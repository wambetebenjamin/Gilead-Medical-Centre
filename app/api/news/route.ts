import { getNewsArticles } from "@/lib/news";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const articles = await getNewsArticles();
  return Response.json(
    articles.map(({ body: _body, ...article }) => article),
    { headers: { "Cache-Control": "no-store" } },
  );
}
