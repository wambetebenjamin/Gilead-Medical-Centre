import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gileadmedicalcentre.co.ke";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/portal", "/api/"] }],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
