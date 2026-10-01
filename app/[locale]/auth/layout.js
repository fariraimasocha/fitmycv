import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return {
    title: t("meta.title"),
    robots: { index: false },
  };
}

export default function AuthLayout({ children }) {
  return children;
}
