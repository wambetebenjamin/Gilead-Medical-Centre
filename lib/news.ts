import fs from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";

export type NewsArticle = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  author: string;
  body: string;
};

type Frontmatter = Record<string, unknown>;
const newsDirectory = path.join(process.cwd(), "content", "news");

function parseArticleSource(source: string, slug: string): NewsArticle {
  const normalized = source.replace(/^\uFEFF/, "");
  const frontmatter = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const parsed = frontmatter ? parseYaml(frontmatter[1]) : {};
  const data = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Frontmatter : {};
  const body = frontmatter ? normalized.slice(frontmatter[0].length) : normalized;
  const metadataValue = (key: string, fallback = "") => String(data[key] ?? fallback);
  return {
    slug,
    title: metadataValue("title", "Gilead Medical Centre update"),
    date: metadataValue("date"),
    category: metadataValue("category", "Hospital News"),
    excerpt: metadataValue("excerpt"),
    author: metadataValue("author", "Gilead Medical Centre"),
    body,
  };
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  let files: string[];
  try {
    files = await fs.readdir(newsDirectory);
  } catch {
    return [];
  }
  const articles = await Promise.all(
    files.filter((file) => file.endsWith(".mdx")).map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const source = await fs.readFile(path.join(newsDirectory, file), "utf8");
      return parseArticleSource(source, slug);
    }),
  );
  return articles.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNewsArticle(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const source = await fs.readFile(path.join(newsDirectory, `${slug}.mdx`), "utf8");
    return parseArticleSource(source, slug);
  } catch {
    return null;
  }
}
