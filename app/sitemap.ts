import type { MetadataRoute } from "next";
import { departments, doctors } from "@/lib/data";
import { getNewsArticles } from "@/lib/news";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gileadmedicalcentre.co.ke";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/about", "/departments", "/doctors", "/services", "/book", "/insurance", "/telemedicine", "/health-packages", "/news", "/contact", "/feedback", "/legal/privacy-policy", "/legal/terms", "/legal/cookie-policy"];
  const publicSlugs = [
    ...departments.map((department) => `/departments/${department.slug}`),
    ...doctors.map((doctor) => `/doctors/${doctor.slug}`),
    ...(await getNewsArticles()).map((article) => `/news/${article.slug}`),
  ];
  const lastModified = new Date();
  return [...staticPaths, ...publicSlugs].map((path) => ({
    url: new URL(path || "/", siteUrl).toString(),
    lastModified,
    changeFrequency: path.startsWith("/news") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/book") ? 0.9 : 0.7,
  }));
}
