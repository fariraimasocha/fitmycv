// One-off broadcast: tell free users the /jobs board exists, and pitch Lifetime.
//
// Run:
//   npm run announce -- --preview                 write the HTML to a file, send nothing
//   npm run announce -- --test you@example.com    send one real email, using that account's real name
//   npm run announce -- --preview --name "jane doe"   check how a given name is greeted
//   npm run announce                              print the recipient count, send nothing
//   npm run announce -- --limit 25 --yes          send to the first 25 recipients
//   npm run announce -- --yes                     send to everyone left
//
// Sends are resumable: each success stamps jobBoardAnnouncedAt on the user, and
// the recipient query skips anyone already stamped. Re-running after a crash
// picks up where it stopped.
//
// package.json is CommonJS, so this .mjs file cannot import the repo's ESM .js
// files. sendEmail (lib/email.js) and sign (lib/sign.js) are inlined below, and
// the email template is copied to .mjs first, the same trick as `check:jobs`.

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import mongoose from "mongoose";

const SITE_URL = "https://www.fitmycv.link";
const FROM = { address: "noreply@fitmycv.link", name: "FitMyCV" };
const DELAY_MS = 1000;
// Cloudflare throttles with code 10004. A short burst is worth retrying; a
// sustained one means the account's DAILY quota is spent and no amount of
// waiting inside this run will help, so stop instead of burning the list.
const RETRY_BACKOFF_MS = [2000, 8000, 30000];
const STOP_AFTER_CONSECUTIVE_THROTTLES = 5;

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const valueOf = (flag) => {
  const i = args.indexOf(flag);
  return i === -1 ? null : args[i + 1];
};

const PREVIEW = has("--preview");
const TEST_TO = valueOf("--test");
const CONFIRMED = has("--yes");
const LIMIT = Number(valueOf("--limit")) || 0;
// --name forces a specific name. --preview has no recipient to look up, so it
// falls back to a real-world messy name that exercises the greeting logic.
const NAME_OVERRIDE = valueOf("--name");
const SAMPLE_NAME = NAME_OVERRIDE ?? "ARNOLD CHIBVONGODZE CHITSA";

// --- inlined from lib/sign.js (must stay byte-identical or verify() fails) ---
function sign(value) {
  if (!process.env.CRON_SECRET) throw new Error("CRON_SECRET env var is not set");
  return crypto
    .createHmac("sha256", process.env.CRON_SECRET)
    .update(String(value))
    .digest("hex")
    .slice(0, 32);
}

const unsubscribeUrl = (userId) =>
  `${SITE_URL}/api/unsubscribe?u=${userId}&s=${sign(String(userId))}`;

// --- inlined from lib/email.js, plus the bulk-sender headers ---
async function sendEmail({ to, subject, html, text, headers }) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_EMAIL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, from: FROM, subject, html, text, headers }),
    },
  );
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(`Email send failed: ${JSON.stringify(data.errors ?? data)}`);
  }
  return data.result;
}

// Gmail and Yahoo require these of bulk senders. POST /api/unsubscribe handles
// the one-click call; the same URL renders a page when a human clicks it.
const listHeaders = (url) => ({
  "List-Unsubscribe": `<${url}>`,
  "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  "X-Campaign-ID": "job-board-launch",
});

// --- template, via the copy-to-.mjs trick ---
const SRC = "lib/announcement-email.js";
const COPY = "lib/announcement-email.mjs";

async function loadTemplate() {
  fs.copyFileSync(SRC, COPY);
  try {
    return await import(path.resolve(COPY));
  } finally {
    fs.rmSync(COPY, { force: true });
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  for (const key of ["MONGODB_URI", "CRON_SECRET"]) {
    if (!process.env[key]) throw new Error(`${key} is not set. Run with: node --env-file=.env`);
  }

  const tpl = await loadTemplate();

  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // Read live so the email never claims a number we cannot back.
  const jobCount = await db.collection("jobs").countDocuments();
  console.log(`Live jobs in the board: ${jobCount}`);

  if (PREVIEW) {
    const html = tpl.buildAnnouncementEmail({
      userName: SAMPLE_NAME,
      jobCount,
      unsubscribeUrl: unsubscribeUrl("000000000000000000000000"),
    });
    const out = path.join(os.tmpdir(), "fitmycv-announcement-preview.html");
    fs.writeFileSync(out, html);
    console.log(`\nSubject: ${tpl.buildAnnouncementSubject(jobCount)}`);
    console.log(`Preview: ${out}`);
    console.log(`Open it: open "${out}"`);
    return;
  }

  if (TEST_TO) {
    // Look the address up so the test is a faithful dry run: that account's real
    // name and its real signed unsubscribe link. --name overrides; an address
    // with no account falls back to the sample name.
    const user = await db
      .collection("users")
      .findOne({ email: TEST_TO }, { projection: { name: 1 } });
    const userName = NAME_OVERRIDE ?? user?.name ?? SAMPLE_NAME;
    const url = unsubscribeUrl(user?._id ?? "000000000000000000000000");
    const payload = { userName, jobCount, unsubscribeUrl: url };
    await sendEmail({
      to: TEST_TO,
      subject: tpl.buildAnnouncementSubject(jobCount),
      html: tpl.buildAnnouncementEmail(payload),
      text: tpl.buildAnnouncementText(payload),
      headers: listHeaders(url),
    });
    const source = NAME_OVERRIDE
      ? "--name override"
      : user
        ? "their account"
        : "no account with that email, sample name";
    console.log(`Test email sent to ${TEST_TO}.`);
    console.log(`  name:     ${JSON.stringify(userName)} (${source})`);
    console.log(`  greeting: "Hi ${tpl.firstNameOf(userName)},"`);
    return;
  }

  // Free users only. $ne keeps legacy docs that predate these fields.
  const query = {
    isPremium: { $ne: true },
    marketingEmails: { $ne: false },
    jobBoardAnnouncedAt: null,
    email: { $exists: true, $nin: [null, ""] },
  };

  const users = await db
    .collection("users")
    .find(query, { projection: { email: 1, name: 1 } })
    .limit(LIMIT || 0)
    .toArray();

  if (!CONFIRMED) {
    const total = await db.collection("users").countDocuments(query);
    console.log(`\n${total} recipients are waiting (free, opted in, not yet emailed).`);
    console.log(`This run would send to ${users.length} of them.`);
    console.log("Nothing was sent. Add --yes to send.");
    return;
  }

  console.log(`\nSending to ${users.length} recipients...`);
  let sent = 0;
  let consecutiveThrottles = 0;
  let quotaExhausted = false;
  const failed = [];

  for (const user of users) {
    const url = unsubscribeUrl(user._id);
    const payload = { userName: user.name, jobCount, unsubscribeUrl: url };
    const message = {
      to: user.email,
      subject: tpl.buildAnnouncementSubject(jobCount),
      html: tpl.buildAnnouncementEmail(payload),
      text: tpl.buildAnnouncementText(payload),
      headers: listHeaders(url),
    };

    let error = null;
    for (let attempt = 0; attempt <= RETRY_BACKOFF_MS.length; attempt++) {
      try {
        await sendEmail(message);
        error = null;
        break;
      } catch (err) {
        error = err;
        if (!err.message.includes("throttled") || attempt === RETRY_BACKOFF_MS.length) break;
        await sleep(RETRY_BACKOFF_MS[attempt]);
      }
    }

    if (!error) {
      // Stamp only after a confirmed send, so a failure is retried next run.
      await db
        .collection("users")
        .updateOne({ _id: user._id }, { $set: { jobBoardAnnouncedAt: new Date() } });
      sent++;
      consecutiveThrottles = 0;
      if (sent % 10 === 0) console.log(`  ${sent}/${users.length}`);
    } else {
      console.error(`  failed: ${user.email}: ${error.message}`);
      failed.push(user.email);
      if (error.message.includes("throttled")) {
        consecutiveThrottles++;
        if (consecutiveThrottles >= STOP_AFTER_CONSECUTIVE_THROTTLES) {
          quotaExhausted = true;
          break;
        }
      } else {
        consecutiveThrottles = 0;
      }
    }
    await sleep(DELAY_MS);
  }

  console.log(`\nDone. sent=${sent} failed=${failed.length}`);
  if (quotaExhausted) {
    const left = await db.collection("users").countDocuments(query);
    console.log(
      `\nStopped early: ${STOP_AFTER_CONSECUTIVE_THROTTLES} throttles in a row even after retries.`,
    );
    console.log("That is the account's daily sending quota, not pacing. Waiting will not help today.");
    console.log(`${left} recipients still unsent. Re-run this exact command tomorrow to continue,`);
    console.log("or request a higher limit at https://developers.cloudflare.com/email-service/platform/limits/");
  } else if (failed.length) {
    console.log("Failed addresses stay unstamped and are picked up by the next run.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.connection.close());
