import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getNewsArticle, getNewsArticles } from "@/lib/news";
import { ArrowLeft } from "@/components/icons";

export const revalidate = 3600;
export const dynamicParams = false;
export async function generateStaticParams() { return (await getNewsArticles()).map((article) => ({ slug: article.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) return { title: "News article not found" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { type: "article", title: article.title, description: article.excerpt, publishedTime: article.date, authors: [article.author], images: ["/images/uganda-child-care.jpg"] },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) notFound();
  return (
    <>
      <section className="page-hero page-hero--compact"><div className="site-container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/news">News</Link><span>/</span><span>{article.category}</span></div><Link className="text-link" href="/news"><ArrowLeft size={15} />All news</Link></div></section>
      <article className="section"><div className="site-container news-article"><p className="eyebrow">{article.category}</p><h1>{article.title}</h1><div className="news-article__meta"><time dateTime={article.date}>{new Date(`${article.date}T12:00:00Z`).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</time><span>·</span><span>{article.author}</span></div><p className="news-article__lead">{article.excerpt}</p><div className="news-article__body"><MDXRemote source={article.body} /></div><p className="news-article__disclaimer">This article offers general information and does not replace advice from a qualified clinician. For individual guidance, please contact your care team.</p></div></article>
    </>
  );
}
