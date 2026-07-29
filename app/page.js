import Header from "@/components/Header";
import Hero from "@/components/landing/Hero";
import JobBoardStrip from "@/components/landing/JobBoardStrip";
import PainPoints from "@/components/landing/PainPoints";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Testimonial from "@/components/landing/Testimonial";
import TrustSignals from "@/components/landing/TrustSignals";
import ResourcesStrip from "@/components/landing/ResourcesStrip";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTABand from "@/components/landing/CTABand";
import Footer from "@/components/landing/Footer";

// The homepage previously shared its title tag with /tailor-cv-from-job-link,
// which put the two pages in competition for the same query. The homepage now
// carries the brand-led title and the feature page keeps the long-tail one.
export const metadata = {
  title: {
    absolute: "FitMyCV: AI Resume & Cover Letter Tailoring From Any Job Link",
  },
  description:
    "FitMyCV tailors your CV and cover letter to any job link in seconds — AI keyword matching, a free ATS resume checker, 11 ATS-safe templates, and one-click PDF export.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "FitMyCV: AI Resume & Cover Letter Tailoring From Any Job Link",
  },
  twitter: {
    title: "FitMyCV: AI Resume & Cover Letter Tailoring From Any Job Link",
  },
};

export default function Home() {
  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main>
        <Hero />
        <JobBoardStrip />
        <PainPoints />
        <HowItWorks />
        <Features />
        <Testimonial />
        <TrustSignals />
        <Pricing />
        <FAQ />
        <ResourcesStrip />
        <CTABand />
      </main>
      <Footer />
    </div>
  );
}
