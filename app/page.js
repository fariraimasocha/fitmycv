import Header from "@/components/Header";
import Hero from "@/components/landing/Hero";
import JobBoardStrip from "@/components/landing/JobBoardStrip";
import PainPoints from "@/components/landing/PainPoints";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Testimonial from "@/components/landing/Testimonial";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTABand from "@/components/landing/CTABand";
import Footer from "@/components/landing/Footer";

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
        <Pricing />
        <FAQ />
        <CTABand />
      </main>
      <Footer />
    </div>
  );
}
