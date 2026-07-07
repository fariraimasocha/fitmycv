// Cloudflare Worker that replaces vercel.json crons.
// It only pings the app on a schedule — all logic stays in Next.js.
const JOBS = {
  "0 8 * * *": ["/api/cron/job-digest"],
};

export default {
  async scheduled(event, env, ctx) {
    const paths = JOBS[event.cron] ?? [];
    const results = await Promise.allSettled(
      paths.map((p) =>
        fetch(env.APP_URL + p, {
          headers: { authorization: `Bearer ${env.CRON_SECRET}` },
        }),
      ),
    );
    results.forEach((r, i) => {
      if (r.status === "rejected") console.error(paths[i], r.reason);
      else if (!r.value.ok) console.error(paths[i], r.value.status);
    });
  },
};
