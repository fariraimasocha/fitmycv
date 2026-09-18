// Production deploy to Cloudflare Workers.
//
// The local .env holds dev values. Next copies .env into the standalone
// output and OpenNext bundles it, where it overrides the Worker secrets at
// runtime (that is how a dev CRON_SECRET ended up live in production). Move
// .env aside for the build so the bundle contains no env file: server values
// then come only from Worker secrets, and NEXT_PUBLIC_* values come from the
// shell environment at build time.
import { execSync } from "node:child_process";
import fs from "node:fs";

const ENV = ".env";
const BACKUP = ".env.local-dev-backup";

const hadEnv = fs.existsSync(ENV);
if (hadEnv) fs.renameSync(ENV, BACKUP);

try {
  execSync("npx opennextjs-cloudflare build", { stdio: "inherit" });
  // Belt and braces: drop any env file that still reached the bundle.
  execSync("find .open-next -name '.env*' -type f -delete", { stdio: "inherit" });
  execSync("npx wrangler deploy", { stdio: "inherit" });
} finally {
  if (hadEnv) fs.renameSync(BACKUP, ENV);
}
