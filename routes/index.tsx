import { define } from "@/utils.ts";
import { articles } from "@/db/schema.ts";
import type { Article } from "@/lib/types.ts";
import { page } from "fresh";

export const handler = define.handlers({
  GET(ctx) {
    const q = ctx.url.searchParams.get("q")?.trim() ?? "";
    const all = articles.findAllPublished();
    const filtered = q
      ? all.filter((a) =>
        a.title.toLowerCase().includes(q.toLowerCase()) ||
        a.body_md.toLowerCase().includes(q.toLowerCase())
      )
      : all;
    return page({ articles: filtered, query: q });
  },
});

function excerpt(md: string, max = 160): string {
  const plain = md
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*|__|`|\*|_/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
  return plain.length > max ? plain.slice(0, max).trimEnd() + "…" : plain;
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 opacity-50"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.65 10.65Z"
      />
    </svg>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div class="flex flex-col items-center gap-4 py-20 text-base-content/50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-20 w-20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
        />
      </svg>
      {query
        ? (
          <p class="text-lg">
            No guides found for "<strong>{query}</strong>"
          </p>
        )
        : <p class="text-lg">No guides published yet.</p>}
      {query && <a href="/" class="btn btn-ghost btn-sm">Clear search</a>}
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const date = new Date(article.created_at).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <a
      href={`/articles/${article.slug}`}
      class="card card-border bg-base-100 hover:shadow-md transition-shadow"
    >
      <div class="card-body gap-2">
        <h2 class="card-title text-xl">{article.title}</h2>
        <p class="text-base-content/70 text-sm leading-relaxed">
          {excerpt(article.body_md)}
        </p>
        <div class="flex items-center gap-2 text-xs text-base-content/50 mt-1">
          {article.author && <span>{article.author}</span>}
          {article.author && <span>·</span>}
          <span>{date}</span>
        </div>
      </div>
    </a>
  );
}

export default define.page<typeof handler>(({ data }) => {
  const { articles, query } = data;

  return (
    <div class="max-w-3xl mx-auto px-4 py-10">
      <h1 class="text-3xl font-bold mb-2">Guides</h1>
      <p class="text-base-content/60 mb-6">
        Browse student guides for PUP Sta. Rosa Campus.
      </p>
      <br />

      <form method="get" action="/" class="mb-8">
        <label class="input input-bordered flex items-center gap-2 w-full max-w-md mx-auto">
          <SearchIcon />
          <input
            type="search"
            name="q"
            value={query}
            placeholder="Search guides…"
            class="grow"
            aria-label="Search guides"
          />
        </label>
      </form>

      {articles.length === 0
        ? <EmptyState query={query} />
        : (
          <div class="flex flex-col gap-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
    </div>
  );
});
