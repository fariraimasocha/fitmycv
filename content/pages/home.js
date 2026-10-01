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

// French, Spanish and German versions of the FAQ and steps above. Same order,
// same claims. English stays the source: edit it first, then these.
const HOME_FAQS_TRANSLATED = {
  fr: [
    { q: "Comment FitMyCV adapte-t-il mon CV ?", a: "Notre IA lit l'offre d'emploi, repère les exigences et les mots-clés importants, puis restructure votre CV pour mettre en avant l'expérience et les compétences qui correspondent. Le résultat passe les filtres ATS et se lit naturellement pour les recruteurs." },
    { q: "Mon CV me ressemblera-t-il toujours ?", a: "Absolument. FitMyCV améliore votre contenu existant. Il ne le remplace pas. Votre voix, votre expérience et vos réalisations restent au premier plan. Nous veillons seulement à les présenter de la meilleure façon pour chaque poste." },
    { q: "Qu'est-ce qui est gratuit, et qu'est-ce qui demande Premium ?", a: "La version gratuite couvre l'essentiel à l'écran : importez votre CV, collez n'importe quel lien d'offre, générez le CV adapté et la lettre de motivation, puis lisez-les en entier sans payer. Premium sert à récupérer les documents et à faire avancer votre recherche : téléchargements PDF illimités de votre CV adapté et de votre lettre de motivation, un score de correspondance et un score ATS sur chaque CV, le suivi des candidatures, les offres enregistrées et des offres correspondantes chaque jour par e-mail." },
    { q: "Dans quels formats puis-je exporter ?", a: "Vous pouvez télécharger votre CV adapté et votre lettre de motivation en PDF, prêts à joindre et à envoyer. Le téléchargement PDF fait partie de Premium. Générer et lire les documents adaptés est gratuit. Le PDF est le format que les recruteurs et les systèmes ATS gèrent le mieux, il garde donc votre mise en page intacte à chaque candidature." },
    { q: "Puis-je résilier mon abonnement à tout moment ?", a: "Oui, vous pouvez résilier votre abonnement Premium à tout moment. Vous gardez l'accès jusqu'à la fin de votre période de facturation. Sans justification, sans frais cachés." },
    { q: "Mes données sont-elles en sécurité ?", a: "Votre vie privée est notre priorité. Toutes les données sont chiffrées, nous ne partageons jamais vos informations, et vous pouvez supprimer votre compte et toutes les données associées à tout moment." },
    { q: "Pourquoi un lien plutôt que de coller la description ?", a: "Un lien permet à FitMyCV de lire toute l'offre pour vous, y compris les exigences cachées dans la page. Vous évitez de copier du texte dans un formulaire et vous partez d'un CV déjà adapté à cette offre." },
    { q: "L'adaptation aide-t-elle vraiment avec les filtres ATS ?", a: "FitMyCV reprend les mots-clés et les compétences du poste dans votre expérience existante. C'est cet alignement que les systèmes ATS analysent. Vous relisez quand même chaque ligne avant de postuler." },
    { q: "La connexion Google est bloquée dans l'application LinkedIn ?", a: "Le navigateur intégré de LinkedIn bloque souvent la connexion Google. Ouvrez fitmycv.link dans Chrome ou Safari, ou utilisez le lien de connexion par e-mail sur la page de connexion. Les deux fonctionnent." },
    { q: "Premium vaut-il le coup si je peux lire le CV à l'écran ?", a: "La lecture à l'écran est gratuite. Premium sert aux téléchargements PDF, aux scores ATS et de correspondance, au suivi des candidatures et au reste des outils. La plupart des gens passent à Premium quand ils sont prêts à envoyer leur candidature." },
  ],
  es: [
    { q: "¿Cómo adapta FitMyCV mi CV?", a: "Nuestra IA lee la oferta de empleo, identifica los requisitos y las palabras clave, y reestructura tu CV para destacar la experiencia y las habilidades que encajan. El resultado pasa los filtros ATS y se lee con naturalidad para los reclutadores." },
    { q: "¿Mi CV seguirá sonando como yo?", a: "Por supuesto. FitMyCV mejora tu contenido existente. No lo reemplaza. Tu voz, tu experiencia y tus logros siguen en primer plano. Solo nos aseguramos de presentarlos de la mejor manera para cada puesto." },
    { q: "¿Qué es gratis y qué necesita Premium?", a: "La versión gratis cubre el flujo principal en pantalla: sube tu CV, pega cualquier enlace de oferta, genera el CV adaptado y la carta de presentación, y léelos completos sin pagar. Premium sirve para sacar los documentos y mantener tu búsqueda en marcha: descargas ilimitadas en PDF de tu CV adaptado y tu carta de presentación, una puntuación de coincidencia y una puntuación ATS en cada CV, seguimiento de candidaturas, empleos guardados y ofertas que encajan contigo cada día por correo." },
    { q: "¿En qué formatos puedo exportar?", a: "Puedes descargar tu CV adaptado y tu carta de presentación en PDF, listos para adjuntar y enviar. La descarga en PDF es la parte Premium. Generar y leer los documentos adaptados es gratis. El PDF es el formato que mejor manejan los reclutadores y los sistemas ATS, así que mantiene tu formato intacto en cada candidatura." },
    { q: "¿Puedo cancelar mi suscripción cuando quiera?", a: "Sí, puedes cancelar tu suscripción Premium en cualquier momento. Seguirás teniendo acceso hasta el final de tu periodo de facturación. Sin preguntas, sin cargos ocultos." },
    { q: "¿Mis datos están seguros?", a: "Tu privacidad es nuestra prioridad. Todos los datos están cifrados, nunca compartimos tu información y puedes eliminar tu cuenta y todos los datos asociados en cualquier momento." },
    { q: "¿Por qué un enlace en vez de pegar la descripción?", a: "Un enlace permite que FitMyCV lea la oferta completa por ti, incluidos los requisitos escondidos en la página. Te ahorras copiar texto en un formulario y empiezas con un CV ya adaptado a esa oferta." },
    { q: "¿Adaptar el CV ayuda de verdad con los filtros ATS?", a: "FitMyCV refleja las palabras clave y las habilidades del puesto en tu experiencia existente. Esa coincidencia es lo que analizan los sistemas ATS. Aun así, revisas cada línea antes de postularte." },
    { q: "¿El inicio de sesión con Google está bloqueado en la app de LinkedIn?", a: "El navegador integrado de LinkedIn suele bloquear el inicio de sesión con Google. Abre fitmycv.link en Chrome o Safari, o usa el enlace de inicio de sesión por correo en la página de acceso. Ambas opciones funcionan." },
    { q: "¿Vale la pena Premium si puedo leer el CV en pantalla?", a: "Leer en pantalla es gratis. Premium es para las descargas en PDF, las puntuaciones ATS y de coincidencia, el seguimiento de candidaturas y el resto de herramientas. La mayoría se pasa a Premium cuando está lista para enviar la candidatura." },
  ],
  de: [
    { q: "Wie passt FitMyCV meinen Lebenslauf an?", a: "Unsere KI liest die Stellenanzeige, erkennt die wichtigsten Anforderungen und Schlüsselwörter und baut deinen Lebenslauf so um, dass passende Erfahrung und Fähigkeiten im Vordergrund stehen. Das Ergebnis besteht ATS-Filter und liest sich für Recruiter natürlich." },
    { q: "Klingt mein Lebenslauf danach noch nach mir?", a: "Auf jeden Fall. FitMyCV verbessert deine vorhandenen Inhalte. Es ersetzt sie nicht. Deine Stimme, deine Erfahrung und deine Erfolge bleiben im Mittelpunkt. Wir sorgen nur dafür, dass sie für jede Stelle bestmöglich dargestellt werden." },
    { q: "Was ist kostenlos, und wofür brauche ich Premium?", a: "Kostenlos ist der zentrale Ablauf auf dem Bildschirm: Lade deinen Lebenslauf hoch, füge einen beliebigen Job-Link ein, erstelle den angepassten Lebenslauf und das Anschreiben und lies beides vollständig, ohne zu zahlen. Premium brauchst du, um die Dokumente herunterzuladen und deine Suche am Laufen zu halten: unbegrenzte PDF-Downloads deines angepassten Lebenslaufs und Anschreibens, ein Match-Score und ein ATS-Score für jeden Lebenslauf, Bewerbungstracking, gespeicherte Jobs und tägliche Job-Vorschläge per E-Mail." },
    { q: "In welchen Formaten kann ich exportieren?", a: "Du kannst deinen angepassten Lebenslauf und dein Anschreiben als PDF herunterladen, fertig zum Anhängen und Versenden. Der PDF-Download gehört zu Premium. Die angepassten Dokumente zu erstellen und zu lesen ist kostenlos. PDF ist das Format, mit dem Recruiter und ATS-Systeme am besten umgehen, deshalb bleibt deine Formatierung bei jeder Bewerbung erhalten." },
    { q: "Kann ich mein Abo jederzeit kündigen?", a: "Ja, du kannst dein Premium-Abo jederzeit kündigen. Du behältst den Zugang bis zum Ende deines Abrechnungszeitraums. Ohne Rückfragen, ohne versteckte Gebühren." },
    { q: "Sind meine Daten sicher?", a: "Deine Privatsphäre hat für uns oberste Priorität. Alle Daten sind verschlüsselt, wir geben deine Informationen nie weiter, und du kannst dein Konto und alle zugehörigen Daten jederzeit löschen." },
    { q: "Warum ein Link statt die Beschreibung einzufügen?", a: "Mit einem Link liest FitMyCV die ganze Anzeige für dich, auch Anforderungen, die tief in der Seite stehen. Du musst keinen Text in ein Formular kopieren und startest mit einem Lebenslauf, der schon zu dieser Anzeige passt." },
    { q: "Hilft das Anpassen wirklich bei ATS-Filtern?", a: "FitMyCV greift die Schlüsselwörter und Fähigkeiten der Stelle in deiner vorhandenen Erfahrung auf. Genau nach dieser Übereinstimmung suchen ATS-Systeme. Du prüfst trotzdem jede Zeile, bevor du dich bewirbst." },
    { q: "Google-Anmeldung in der LinkedIn-App blockiert?", a: "Der In-App-Browser von LinkedIn blockiert oft die Google-Anmeldung. Öffne fitmycv.link in Chrome oder Safari, oder nutze den Anmeldelink per E-Mail auf der Anmeldeseite. Beides funktioniert." },
    { q: "Lohnt sich Premium, wenn ich den Lebenslauf auf dem Bildschirm lesen kann?", a: "Lesen auf dem Bildschirm ist kostenlos. Premium ist für PDF-Downloads, ATS- und Match-Scores, Bewerbungstracking und die restlichen Tools. Die meisten wechseln zu Premium, wenn sie bereit sind, die Bewerbung abzuschicken." },
  ],
};

const HOME_STEPS_TRANSLATED = {
  fr: [
    { title: "Collez l'offre d'emploi", copy: "Déposez un lien de LinkedIn, Indeed ou de n'importe quelle page carrières. Nous analysons les exigences, les compétences et les mots-clés instantanément." },
    { title: "L'IA adapte votre CV", copy: "Nous réécrivons vos points clés avec plus d'impact, reprenons les mots-clés du poste et gardons votre voix, prêt pour les ATS en 30 secondes environ." },
    { title: "Téléchargez et postulez", copy: "Exportez un CV soigné et la lettre de motivation assortie en PDF. Un seul tableau de bord suit chaque candidature." },
  ],
  es: [
    { title: "Pega la oferta de empleo", copy: "Pega un enlace de LinkedIn, Indeed o cualquier página de empleo. Analizamos requisitos, habilidades y palabras clave al instante." },
    { title: "La IA adapta tu CV", copy: "Reescribimos tus logros con más impacto, reflejamos las palabras clave del puesto y mantenemos tu voz, listo para ATS en unos 30 segundos." },
    { title: "Descarga y postúlate", copy: "Exporta un CV pulido y la carta de presentación a juego en PDF. Un solo panel sigue cada candidatura." },
  ],
  de: [
    { title: "Stellenanzeige einfügen", copy: "Füge einen Link von LinkedIn, Indeed oder einer beliebigen Karriereseite ein. Wir erfassen Anforderungen, Fähigkeiten und Schlüsselwörter sofort." },
    { title: "KI passt deinen Lebenslauf an", copy: "Wir formulieren deine Stichpunkte wirkungsvoller, greifen die Schlüsselwörter der Stelle auf und behalten deine Stimme bei, ATS-tauglich in etwa 30 Sekunden." },
    { title: "Herunterladen und bewerben", copy: "Exportiere einen ausgefeilten Lebenslauf und das passende Anschreiben als PDF. Ein Dashboard verfolgt jede Bewerbung." },
  ],
};

export const getHomeFaqs = (locale) => HOME_FAQS_TRANSLATED[locale] ?? HOME_FAQS;

export const getHomeSteps = (locale) =>
  HOME_STEPS.map((step, i) => ({ ...step, ...HOME_STEPS_TRANSLATED[locale]?.[i] }));

// The quote stays in the words the person used. Only their role is translated.
const HOME_TESTIMONIAL_ROLE = {
  fr: "Développeur logiciel",
  es: "Desarrollador de software",
  de: "Softwareentwickler",
};

export const getHomeTestimonial = (locale) => ({
  ...HOME_TESTIMONIAL,
  role: HOME_TESTIMONIAL_ROLE[locale] ?? HOME_TESTIMONIAL.role,
});
