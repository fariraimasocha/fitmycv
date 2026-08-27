import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function CTABand() {
  return (
    <section className="landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-container landing-card-strong flex flex-col items-center gap-8 overflow-hidden rounded-3xl border border-[var(--landing-line)] px-6 py-14 sm:px-10">
        <h2 className="landing-section-title text-center text-2xl sm:text-3xl lg:text-4xl">
          Ready to stop being ignored?
        </h2>
        <p className="max-w-[560px] text-center text-base leading-relaxed text-[var(--landing-ink-soft)]">
          Join job seekers landing interviews faster with AI-tailored
          applications — lifetime access from $16.99.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/auth" className="landing-primary-btn text-sm">
            Get FitMyCV
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <Link href="#pricing" className="landing-secondary-btn text-sm">
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
