export default function robots() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://fitmycv.link";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
