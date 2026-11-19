import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import { connectDB } from "@/utils/connect";
import Creator from "@/models/Creator";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your referral stats",
  robots: { index: false, follow: false },
};

const fmt = (n) => n.toLocaleString("en-GB");

export default async function CreatorStatsPage({ params }) {
  setRequestLocale("en");
  const { token } = await params;
  if (!/^[a-f0-9]{32}$/.test(token)) notFound();

  await connectDB();
  const creator = await Creator.findOne({ statsToken: token }).lean();
  if (!creator) notFound();
  const signups = await User.countDocuments({ referredBy: creator.code });
  const rate = creator.visitors ? Math.round((signups / creator.visitors) * 100) : 0;

  const stats = [
    { label: "Clicks", value: fmt(creator.clicks), note: "Every time your link was opened." },
    { label: "Visitors", value: fmt(creator.visitors), note: "Different people, counted once each." },
    { label: "Signups", value: fmt(signups), note: "Visitors who created an account." },
    { label: "Signup rate", value: `${rate}%`, note: "Signups out of visitors." },
  ];

  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main dir="ltr">
        <section className="px-5 pb-10 pt-32 sm:px-10 lg:px-16 xl:px-24">
          <div className="landing-container flex flex-col items-center text-center">
            <div className="landing-eyebrow">
              <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--landing-primary)]" />
              Referral stats
            </div>
            <h1
              className="font-serif-display mt-6 max-w-3xl font-normal leading-[1.02] text-[var(--landing-ink)]"
              style={{ fontSize: "clamp(32px, 4.6vw, 56px)" }}
            >
              Hi {creator.name}, here is your reach.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--landing-ink-soft)]">
              Your link: <span className="font-semibold text-[var(--landing-ink)]">fitmycv.link/r/{creator.code}</span>.
              A signup counts if the person joins within 30 days of their first click.
            </p>
          </div>
        </section>

        <section className="landing-section-tight">
          <div className="landing-container mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            {stats.map(({ label, value, note }) => (
              <div key={label} className="landing-card flex flex-col gap-2 rounded-2xl p-7">
                <span className="font-outfit text-sm font-bold text-[var(--landing-ink-soft)]">{label}</span>
                <span className="font-outfit text-5xl font-extrabold tabular-nums text-[var(--landing-ink)]">{value}</span>
                <span className="landing-copy text-sm">{note}</span>
              </div>
            ))}
          </div>
          <p className="landing-container mt-8 text-center text-sm text-[var(--landing-ink-soft)]">
            Keep this page private. Anyone with the link can see these numbers.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
