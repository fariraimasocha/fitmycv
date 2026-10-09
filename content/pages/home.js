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
    a: "Free covers the core workflow on screen: upload your CV, paste any job link, and generate the tailored CV and the cover letter. You see a preview without paying: the summary, the first line of each role, and the opening paragraph of the cover letter. Premium unlocks the full documents and keeps the search running: unlimited PDF downloads of your tailored CV and cover letter, a match score and an ATS score on every CV, application tracking, saved jobs, and daily job matches by email.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel your Premium subscription at any time. You'll continue to have access until the end of your billing period. No questions asked, no hidden fees.",
  },
  {
    q: "Why a job link instead of pasting the description?",
    a: "A link lets FitMyCV read the full posting for you, including requirements buried in the page. You skip copying text into a form and start with a CV already matched to that listing.",
  },
  {
    q: "Does tailoring actually help with ATS filters?",
    a: "FitMyCV mirrors the role's keywords and skills in your existing experience. That alignment is what ATS systems scan for. You still review every line before you apply.",
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

// Translated versions of the FAQ and steps above. Same order,
// same claims. English stays the source: edit it first, then these.
const HOME_FAQS_TRANSLATED = {
  fr: [
    { q: "Comment FitMyCV adapte-t-il mon CV ?", a: "Notre IA lit l'offre d'emploi, repère les exigences et les mots-clés importants, puis restructure votre CV pour mettre en avant l'expérience et les compétences qui correspondent. Le résultat passe les filtres ATS et se lit naturellement pour les recruteurs." },
    { q: "Mon CV me ressemblera-t-il toujours ?", a: "Absolument. FitMyCV améliore votre contenu existant. Il ne le remplace pas. Votre voix, votre expérience et vos réalisations restent au premier plan. Nous veillons seulement à les présenter de la meilleure façon pour chaque poste." },
    { q: "Qu'est-ce qui est gratuit, et qu'est-ce qui demande Premium ?", a: "La version gratuite couvre l'essentiel à l'écran : importez votre CV, collez n'importe quel lien d'offre, générez le CV adapté et la lettre de motivation. Sans payer, vous voyez un aperçu : le résumé, la première ligne de chaque poste et le premier paragraphe de la lettre. Premium débloque les documents complets et fait avancer votre recherche : téléchargements PDF illimités de votre CV adapté et de votre lettre de motivation, un score de correspondance et un score ATS sur chaque CV, le suivi des candidatures, les offres enregistrées et des offres correspondantes chaque jour par e-mail." },
    { q: "Puis-je résilier mon abonnement à tout moment ?", a: "Oui, vous pouvez résilier votre abonnement Premium à tout moment. Vous gardez l'accès jusqu'à la fin de votre période de facturation. Sans justification, sans frais cachés." },
    { q: "Pourquoi un lien plutôt que de coller la description ?", a: "Un lien permet à FitMyCV de lire toute l'offre pour vous, y compris les exigences cachées dans la page. Vous évitez de copier du texte dans un formulaire et vous partez d'un CV déjà adapté à cette offre." },
    { q: "L'adaptation aide-t-elle vraiment avec les filtres ATS ?", a: "FitMyCV reprend les mots-clés et les compétences du poste dans votre expérience existante. C'est cet alignement que les systèmes ATS analysent. Vous relisez quand même chaque ligne avant de postuler." },
  ],
  es: [
    { q: "¿Cómo adapta FitMyCV mi CV?", a: "Nuestra IA lee la oferta de empleo, identifica los requisitos y las palabras clave, y reestructura tu CV para destacar la experiencia y las habilidades que encajan. El resultado pasa los filtros ATS y se lee con naturalidad para los reclutadores." },
    { q: "¿Mi CV seguirá sonando como yo?", a: "Por supuesto. FitMyCV mejora tu contenido existente. No lo reemplaza. Tu voz, tu experiencia y tus logros siguen en primer plano. Solo nos aseguramos de presentarlos de la mejor manera para cada puesto." },
    { q: "¿Qué es gratis y qué necesita Premium?", a: "La versión gratis cubre el flujo principal en pantalla: sube tu CV, pega cualquier enlace de oferta, genera el CV adaptado y la carta de presentación. Sin pagar ves una vista previa: el resumen, la primera línea de cada puesto y el primer párrafo de la carta. Premium desbloquea los documentos completos y mantiene tu búsqueda en marcha: descargas ilimitadas en PDF de tu CV adaptado y tu carta de presentación, una puntuación de coincidencia y una puntuación ATS en cada CV, seguimiento de candidaturas, empleos guardados y ofertas que encajan contigo cada día por correo." },
    { q: "¿Puedo cancelar mi suscripción cuando quiera?", a: "Sí, puedes cancelar tu suscripción Premium en cualquier momento. Seguirás teniendo acceso hasta el final de tu periodo de facturación. Sin preguntas, sin cargos ocultos." },
    { q: "¿Por qué un enlace en vez de pegar la descripción?", a: "Un enlace permite que FitMyCV lea la oferta completa por ti, incluidos los requisitos escondidos en la página. Te ahorras copiar texto en un formulario y empiezas con un CV ya adaptado a esa oferta." },
    { q: "¿Adaptar el CV ayuda de verdad con los filtros ATS?", a: "FitMyCV refleja las palabras clave y las habilidades del puesto en tu experiencia existente. Esa coincidencia es lo que analizan los sistemas ATS. Aun así, revisas cada línea antes de postularte." },
  ],
  de: [
    { q: "Wie passt FitMyCV meinen Lebenslauf an?", a: "Unsere KI liest die Stellenanzeige, erkennt die wichtigsten Anforderungen und Schlüsselwörter und baut deinen Lebenslauf so um, dass passende Erfahrung und Fähigkeiten im Vordergrund stehen. Das Ergebnis besteht ATS-Filter und liest sich für Recruiter natürlich." },
    { q: "Klingt mein Lebenslauf danach noch nach mir?", a: "Auf jeden Fall. FitMyCV verbessert deine vorhandenen Inhalte. Es ersetzt sie nicht. Deine Stimme, deine Erfahrung und deine Erfolge bleiben im Mittelpunkt. Wir sorgen nur dafür, dass sie für jede Stelle bestmöglich dargestellt werden." },
    { q: "Was ist kostenlos, und wofür brauche ich Premium?", a: "Kostenlos ist der zentrale Ablauf auf dem Bildschirm: Lade deinen Lebenslauf hoch, füge einen beliebigen Job-Link ein, erstelle den angepassten Lebenslauf und das Anschreiben. Ohne zu zahlen siehst du eine Vorschau: die Zusammenfassung, die erste Zeile jeder Stelle und den ersten Absatz des Anschreibens. Premium schaltet die vollständigen Dokumente frei und hält deine Suche am Laufen: unbegrenzte PDF-Downloads deines angepassten Lebenslaufs und Anschreibens, ein Match-Score und ein ATS-Score für jeden Lebenslauf, Bewerbungstracking, gespeicherte Jobs und tägliche Job-Vorschläge per E-Mail." },
    { q: "Kann ich mein Abo jederzeit kündigen?", a: "Ja, du kannst dein Premium-Abo jederzeit kündigen. Du behältst den Zugang bis zum Ende deines Abrechnungszeitraums. Ohne Rückfragen, ohne versteckte Gebühren." },
    { q: "Warum ein Link statt die Beschreibung einzufügen?", a: "Mit einem Link liest FitMyCV die ganze Anzeige für dich, auch Anforderungen, die tief in der Seite stehen. Du musst keinen Text in ein Formular kopieren und startest mit einem Lebenslauf, der schon zu dieser Anzeige passt." },
    { q: "Hilft das Anpassen wirklich bei ATS-Filtern?", a: "FitMyCV greift die Schlüsselwörter und Fähigkeiten der Stelle in deiner vorhandenen Erfahrung auf. Genau nach dieser Übereinstimmung suchen ATS-Systeme. Du prüfst trotzdem jede Zeile, bevor du dich bewirbst." },
  ],
  pt: [
    { q: "Como o FitMyCV adapta meu currículo?", a: "Nossa IA lê a descrição da vaga, identifica os principais requisitos e palavras-chave e reorganiza seu currículo para destacar a experiência e as habilidades que combinam com a vaga. O resultado passa nos filtros de ATS e soa natural para os recrutadores." },
    { q: "Meu currículo ainda vai soar como eu?", a: "Com certeza. O FitMyCV melhora o conteúdo que você já tem. Ele não o substitui. Sua voz, sua experiência e suas conquistas continuam em primeiro plano. Só garantimos que elas sejam apresentadas da melhor forma para cada vaga." },
    { q: "O que é grátis e o que precisa do Premium?", a: "O plano grátis cobre o fluxo principal na tela: envie seu currículo, cole qualquer link de vaga, gere o currículo adaptado e a carta de apresentação. Sem pagar, você vê uma prévia: o resumo, a primeira linha de cada cargo e o primeiro parágrafo da carta. O Premium libera os documentos completos e mantém sua busca andando: downloads ilimitados em PDF do seu currículo adaptado e da sua carta de apresentação, pontuação de compatibilidade e pontuação ATS em cada currículo, acompanhamento de candidaturas, vagas salvas e vagas compatíveis por e-mail todos os dias." },
    { q: "Posso cancelar minha assinatura quando quiser?", a: "Sim, você pode cancelar sua assinatura Premium a qualquer momento. Você continua com acesso até o fim do período de cobrança. Sem perguntas e sem taxas escondidas." },
    { q: "Por que um link em vez de colar a descrição?", a: "Um link permite que o FitMyCV leia o anúncio completo por você, incluindo requisitos escondidos na página. Você não precisa copiar texto para um formulário e já começa com um currículo adaptado àquela vaga." },
    { q: "Adaptar o currículo ajuda mesmo com os filtros de ATS?", a: "O FitMyCV reflete as palavras-chave e as habilidades da vaga na experiência que você já tem. É esse alinhamento que os sistemas ATS procuram. Você ainda revisa cada linha antes de se candidatar." },
  ],
  zh: [
    { q: "FitMyCV 如何定制我的简历？", a: "我们的 AI 会读取职位描述，找出关键要求和关键词，然后调整你简历的结构，突出相匹配的经历和技能。结果能通过 ATS 筛选，招聘人员读起来也很自然。" },
    { q: "我的简历读起来还会像我写的吗？", a: "当然会。FitMyCV 是在你现有内容的基础上改进，而不是替换它。你的口吻、经历和成就依然是重点。我们只是确保它们以最适合每个职位的方式呈现。" },
    { q: "哪些功能免费，哪些需要 Premium？", a: "免费版涵盖屏幕上的核心流程：上传你的简历，粘贴任意职位链接，生成定制简历和求职信。无需付费即可查看预览：个人简介、每段工作经历的第一行，以及求职信的第一段。Premium 解锁完整文件，并持续推进你的求职：不限次数地将定制简历和求职信下载为 PDF，每份简历的匹配度评分和 ATS 评分，求职申请跟踪，已保存的职位，以及每日邮件职位推荐。" },
    { q: "我可以随时取消订阅吗？", a: "可以，你可以随时取消 Premium 订阅。在当前计费周期结束前，你仍可继续使用。无需说明理由，没有隐藏费用。" },
    { q: "为什么用职位链接，而不是粘贴职位描述？", a: "有了链接，FitMyCV 就能替你读取完整的职位信息，包括藏在页面深处的要求。你不用把文字复制到表单里，一开始就能得到一份已与该职位匹配的简历。" },
    { q: "定制真的有助于通过 ATS 筛选吗？", a: "FitMyCV 会在你现有的经历中体现该职位的关键词和技能。ATS 系统扫描的正是这种契合度。申请前，你仍然要检查每一行内容。" },
  ],
  ar: [
    { q: "كيف يخصّص FitMyCV سيرتي الذاتية؟", a: "يقرأ الذكاء الاصطناعي لدينا الوصف الوظيفي، ويحدد المتطلبات والكلمات المفتاحية الأساسية، ثم يعيد هيكلة سيرتك الذاتية لإبراز الخبرة والمهارات المطابقة. النتيجة تجتاز فلاتر ATS وتُقرأ بشكل طبيعي لدى مسؤولي التوظيف." },
    { q: "هل ستبقى سيرتي الذاتية معبّرة عني؟", a: "بالتأكيد. يحسّن FitMyCV محتواك الحالي ولا يستبدله. يبقى أسلوبك وخبرتك وإنجازاتك في الواجهة. نحن فقط نتأكد من عرضها بأفضل طريقة ممكنة لكل وظيفة." },
    { q: "ما الذي أحصل عليه مجانًا، وما الذي يحتاج إلى Premium؟", a: "تغطي الخطة المجانية سير العمل الأساسي على الشاشة: ارفع سيرتك الذاتية، والصق أي رابط وظيفة، وأنشئ السيرة الذاتية المخصصة وخطاب التقديم. دون أن تدفع، ترى معاينة: الملخص، والسطر الأول من كل وظيفة، والفقرة الأولى من خطاب التقديم. أما Premium فيفتح المستندات كاملة ويواصل بحثك عن عمل: تنزيلات PDF بلا حدود لسيرتك الذاتية المخصصة وخطاب التقديم، ودرجة مطابقة ودرجة ATS لكل سيرة ذاتية، ومتابعة الطلبات، والوظائف المحفوظة، ووظائف مطابقة يوميًا عبر البريد الإلكتروني." },
    { q: "هل يمكنني إلغاء اشتراكي في أي وقت؟", a: "نعم، يمكنك إلغاء اشتراك Premium في أي وقت. وسيبقى وصولك متاحًا حتى نهاية فترة الفوترة. دون أي أسئلة، ودون رسوم خفية." },
    { q: "لماذا رابط وظيفة بدلًا من لصق الوصف؟", a: "يتيح الرابط لـ FitMyCV أن يقرأ الإعلان كاملًا نيابة عنك، بما في ذلك المتطلبات المدفونة في الصفحة. فتتخطى نسخ النص إلى نموذج، وتبدأ بسيرة ذاتية مطابقة لذلك الإعلان بالفعل." },
    { q: "هل يساعد التخصيص فعلًا مع فلاتر ATS؟", a: "يعكس FitMyCV الكلمات المفتاحية والمهارات الخاصة بالوظيفة في خبرتك الحالية. وهذا التوافق هو ما تبحث عنه أنظمة ATS. ومع ذلك تراجع كل سطر قبل أن تتقدّم." },
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
  pt: [
    { title: "Cole o anúncio da vaga", copy: "Cole um link do LinkedIn, Indeed ou de qualquer página de carreiras. Extraímos requisitos, habilidades e palavras-chave na hora." },
    { title: "A IA adapta seu currículo", copy: "Reescrevemos seus tópicos com mais impacto, refletimos as palavras-chave da vaga e mantemos sua voz, pronto para ATS em cerca de 30 segundos." },
    { title: "Baixe e se candidate", copy: "Exporte em PDF um currículo bem acabado e uma carta de apresentação que combina com ele. Um único painel acompanha todas as candidaturas." },
  ],
  zh: [
    { title: "粘贴职位信息", copy: "放入来自 LinkedIn、Indeed 或任意招聘页面的链接。我们会立即解析其中的要求、技能和关键词。" },
    { title: "AI 定制你的简历", copy: "我们会改写要点让它更有力，沿用职位的关键词，并保留你的口吻，约 30 秒即可得到适配 ATS 的简历。" },
    { title: "下载并申请", copy: "将一份精心打磨的简历和相匹配的求职信导出为 PDF。一个控制台即可跟踪每份申请。" },
  ],
  ar: [
    { title: "الصق إعلان الوظيفة", copy: "ضع رابطًا من LinkedIn أو Indeed أو أي صفحة وظائف. نحلّل المتطلبات والمهارات والكلمات المفتاحية فورًا." },
    { title: "الذكاء الاصطناعي يخصّص سيرتك الذاتية", copy: "نعيد كتابة نقاطك بتأثير أقوى، ونعكس الكلمات المفتاحية للوظيفة، ونحافظ على أسلوبك، جاهزة لأنظمة ATS في نحو 30 ثانية." },
    { title: "نزّل وتقدّم", copy: "صدّر سيرة ذاتية مصقولة وخطاب تقديم مطابقًا بصيغة PDF. ولوحة تحكم واحدة تتابع كل طلب." },
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
  pt: "Desenvolvedor de software",
  zh: "软件开发工程师",
  ar: "مطوّر برمجيات",
};

export const getHomeTestimonial = (locale) => ({
  ...HOME_TESTIMONIAL,
  role: HOME_TESTIMONIAL_ROLE[locale] ?? HOME_TESTIMONIAL.role,
});
