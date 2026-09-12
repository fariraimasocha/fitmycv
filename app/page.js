import Header from "@/components/Header";
import Hero from "@/components/landing/Hero";
import JobBoardStrip from "@/components/landing/JobBoardStrip";
import TheProblem from "@/components/landing/TheProblem";
import HowItWorks from "@/components/landing/HowItWorks";
import TemplateStrip from "@/components/landing/TemplateStrip";
import Testimonial from "@/components/landing/Testimonial";
import TrustSignals from "@/components/landing/TrustSignals";
import ResourcesStrip from "@/components/landing/ResourcesStrip";
import Pricing from "@/components/landing/Pricing";
import CTABand from "@/components/landing/CTABand";
import Footer from "@/components/landing/Footer";
import StickyCtaBar from "@/components/landing/StickyCtaBar";
import FounderFaqSection from "@/components/landing/FounderFaqSection";
import { WebviewGateProvider } from "@/components/landing/WebviewGateProvider";
import JsonLd from "@/components/JsonLd";
import { faqSchema, howToSchema } from "@/lib/seo";
import {
  getSoftwareApplicationSchema,
  webPageSchema,
  reviewSchema,
} from "@/lib/structured-data";
import { HOME_FAQS, HOME_STEPS, HOME_TESTIMONIAL } from "@/content/pages/home";
import { getServerPricing } from "@/lib/server-pricing";

export const metadata = {
  title: {
    absolute: "Tailor Your CV to Any Job Link | FitMyCV",
  },
  description:
    "Tailor your CV and cover letter to any job link in seconds: AI keyword matching, a free ATS resume checker, 19 ATS-safe templates, and one-click PDF export.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "FitMyCV: AI Resume & Cover Letter Tailoring From Any Job Link",
    images: [
      {
        url: "/hero-new.png",
        width: 3024,
        height: 1724,
        alt: "FitMyCV: Land more interviews with a CV that fits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FitMyCV: AI Resume & Cover Letter Tailoring From Any Job Link",
    images: ["/hero-new.png"],
  },
};

export default async function Home() {
  const { pricing } = await getServerPricing();

  return (
    <div className="landing-root min-h-screen">
      <WebviewGateProvider>
        <Header />
        <main>
          <Hero lifetimePrice={pricing.lifetime.price} />
          <JobBoardStrip />
          <TheProblem />
          <HowItWorks lifetimePrice={pricing.lifetime.price} />
          <TemplateStrip />
          <Testimonial />
          <TrustSignals />
          <Pricing />
          <FounderFaqSection />
          <ResourcesStrip />
          <CTABand lifetimePrice={pricing.lifetime.price} />
        </main>
        <StickyCtaBar />
      </WebviewGateProvider>
      <Footer />
      <JsonLd
        data={webPageSchema({
          name: "Tailor Your CV to Any Job Link",
          description: metadata.description,
          path: "/",
        })}
      />
      <JsonLd data={faqSchema(HOME_FAQS)} />
      <JsonLd
        data={howToSchema({
          name: "How to tailor your CV to a job link",
          description:
            "Paste a job link, let FitMyCV rewrite your CV against the role's requirements, then download the CV and cover letter as PDFs.",
          steps: HOME_STEPS.map(({ title, copy }) => ({
            name: title,
            text: copy,
          })),
        })}
      />
      <JsonLd data={getSoftwareApplicationSchema(pricing)} />
      <JsonLd data={reviewSchema(HOME_TESTIMONIAL)} />
    </div>
  );
}
