import type { Metadata } from "next";
import Link from "next/link";
import { getNewsArticles } from "@/lib/news";
import { ArrowRight } from "@/components/icons";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Health News & Announcements", description: "Health tips, hospital news and community updates from Gilead Medical Centre." };

export default async function NewsPage() {
  const articles = await getNewsArticles();
  return (
    <>
      <section className="page-hero"><div className="site-container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>News</span></div><p className="eyebrow">From our care community</p><h1>Health notes and updates.</h1><p>Helpful information for patients and families, plus announcements from Gilead Medical Centre.</p></div></section>
      <section className="section"><div className="site-container"><div className="news-grid news-grid--page">{articles.map((article) => <article className="news-card" key={article.slug}><div className="news-card__meta"><span className="news-card__category">{article.category}</span><span>·</span><time dateTime={article.date}>{new Date(`${article.date}T12:00:00Z`).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</time></div><h2>{article.title}</h2><p>{article.excerpt}</p><Link href={`/news/${article.slug}`}>Read article<ArrowRight size={15} /></Link></article>)}</div>{!articles.length && <div className="portal-empty"><strong>No news articles are available yet.</strong></div>}</div></section>
    </>
  );
}
