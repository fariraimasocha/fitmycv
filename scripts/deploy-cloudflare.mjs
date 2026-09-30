// Production deploy to Cloudflare Workers.
//
// The local .env holds dev values. Next copies .env into the standalone
// output and OpenNext bundles it, where it overrides the Worker secrets at
// runtime (that is how a dev CRON_SECRET ended up live in production). Move
// .env aside for the build so the bundle contains no env file: server values
// then come only from Worker secrets. NEXT_PUBLIC_* values are inlined into
// the client bundle at build time, so pass them from .env to the build (the
// shell wins if it sets one). Without this the browser gets no PostHog token.
import { execSync } from "node:child_process";
import fs from "node:fs";
import { parseEnv } from "node:util";

const ENV = ".env";
const BACKUP = ".env.local-dev-backup";

const hadEnv = fs.existsSync(ENV);
const publicVars = hadEnv
  ? Object.fromEntries(
      Object.entries(parseEnv(fs.readFileSync(ENV, "utf8"))).filter(([key]) =>
        key.startsWith("NEXT_PUBLIC_"),
      ),
    )
  : {};
if (hadEnv) fs.renameSync(ENV, BACKUP);

try {
  execSync("npx opennextjs-cloudflare build", {
    stdio: "inherit",
    env: { ...publicVars, ...process.env },
  });
  // Belt and braces: drop any env file that still reached the bundle.
  execSync("find .open-next -name '.env*' -type f -delete", { stdio: "inherit" });
  execSync("npx wrangler deploy", { stdio: "inherit" });
} finally {
  if (hadEnv) fs.renameSync(BACKUP, ENV);
}
