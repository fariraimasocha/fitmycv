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
import StickyCtaBar from "@/components/landing/StickyCtaBar";
import JsonLd from "@/components/JsonLd";
import { faqSchema, howToSchema } from "@/lib/seo";
import {
  softwareApplicationSchema,
  webPageSchema,
  reviewSchema,
} from "@/lib/structured-data";
import { HOME_FAQS, HOME_STEPS, HOME_TESTIMONIAL } from "@/content/pages/home";

// The homepage previously shared its title tag with /tailor-cv-from-job-link,
// which put the two pages in competition for the same query. The homepage now
// carries the brand-led title and the feature page keeps the long-tail one.
export const metadata = {
  title: {
    absolute: "Tailor Your CV to Any Job Link | FitMyCV",
  },
  description:
    "Tailor your CV and cover letter to any job link in seconds: AI keyword matching, a free ATS resume checker, 16 ATS-safe templates, and one-click PDF export.",
  alternates: { canonical: "/" },
  // Page-level openGraph/twitter replace the layout objects wholesale (no
  // deep merge), so images and card type must be re-declared here.
  openGraph: {
    title: "FitMyCV: AI Resume & Cover Letter Tailoring From Any Job Link",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FitMyCV: Land more interviews with a CV that fits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FitMyCV: AI Resume & Cover Letter Tailoring From Any Job Link",
    images: ["/og-image.jpg"],
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
      <StickyCtaBar />
      <Footer />
      {/* Every node below restates something a visitor can read on this page:
          the H1 subject, the how-it-works steps, the FAQ answers, the pricing
          cards, and the one attributed quote. */}
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
      <JsonLd data={softwareApplicationSchema} />
      <JsonLd data={reviewSchema(HOME_TESTIMONIAL)} />
    </div>
  );
}
