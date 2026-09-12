// Homepage FAQ copy. Shared so the visible accordion and FAQPage schema
// stay on the same questions and answers.
export const HOME_FAQS = [
  {
    q: "How does FitMyCV tailor my CV?",
    a: "Our AI reads the job description, identifies key requirements and keywords, then restructures your CV to highlight matching experience and skills. The result passes ATS filters and reads naturally to recruiters.",
  },
  {
    q: "Will my CV still sound like me?",
    a: "Absolutely. FitMyCV enhances your existing content. It doesn't replace it. Your voice, experience, and achievements remain front and center. We just make sure they're presented in the best possible way for each role.",
  },
  {
    q: "What do I get for free, and what needs Premium?",
    a: "Free covers the core workflow on screen: upload your CV, paste any job link, and generate the tailored CV and the cover letter, then read them in full without paying. Premium is for getting the documents out and keeping the search running: unlimited PDF downloads of your tailored CV and cover letter, a match score and an ATS score on every CV, application tracking, saved jobs, and daily job matches by email.",
  },
  {
    q: "What file formats can I export?",
    a: "You can download your tailored CV and cover letter as PDF, ready to attach and send. PDF download is the Premium part; generating and reading the tailored documents is free. PDF is the format recruiters and ATS systems handle best, so it keeps your formatting perfect on every application.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel your Premium subscription at any time. You'll continue to have access until the end of your billing period. No questions asked, no hidden fees.",
  },
  {
    q: "Is my data safe?",
    a: "Your privacy is our top priority. All data is encrypted, we never share your information, and you can delete your account and all associated data at any time.",
  },
  {
    q: "Why a job link instead of pasting the description?",
    a: "A link lets FitMyCV read the full posting for you, including requirements buried in the page. You skip copying text into a form and start with a CV already matched to that listing.",
  },
  {
    q: "Does tailoring actually help with ATS filters?",
    a: "FitMyCV mirrors the role's keywords and skills in your existing experience. That alignment is what ATS systems scan for. You still review every line before you apply.",
  },
  {
    q: "Google sign-in blocked in the LinkedIn app?",
    a: "The LinkedIn in-app browser often blocks Google sign-in. Open fitmycv.link in Chrome or Safari, or use the email sign-in link on the auth page. Both paths work.",
  },
  {
    q: "Is Premium worth it if I can read the CV on screen?",
    a: "Reading on screen is free. Premium is for PDF downloads, ATS and match scores, application tracking, and the rest of the toolkit. Most people upgrade when they are ready to send the application.",
  },
];

// The three visible "How it works" steps. Shared so the section on screen and
// the HowTo schema describe the same process.
export const HOME_STEPS = [
  {
    num: "01",
    title: "Paste the job listing",
    copy: "Drop a link from LinkedIn, Indeed, or any careers page. We parse requirements, skills, and keywords instantly.",
  },
  {
    num: "02",
    title: "AI tailors your CV",
    copy: "We rewrite bullet points with impact, mirror the role's keywords, and keep your voice, ATS-ready in ~30 seconds.",
  },
  {
    num: "03",
    title: "Download & apply",
    copy: "Export a polished CV and matching cover letter as PDF. One dashboard tracks every application.",
  },
];

// The one testimonial we have permission to publish, with the name and role of
// the person who gave it. Shared so the visible quote and the Review schema
// carry identical text. Only add entries here for real, attributable feedback.
export const HOME_TESTIMONIAL = {
  quote:
    "Not having to rewrite my CV manually is saving me tons of application work. Now I just paste a job link and FitMyCV handles everything itself",
  author: "Farai Matsika",
  role: "Software Developer",
  image: "/farai.jpeg",
};
