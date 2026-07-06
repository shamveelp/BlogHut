import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GridBlogCard } from "./BlogCards";

export default async function SimilarBlogs({
  currentId,
  category,
  tags = [],
}: {
  currentId: string;
  category: string;
  tags: string[];
}) {
  const supabase = await createSupabaseServerClient();
  
  // Fetch up to 50 recent published blogs to find matches
  const { data: allBlogs } = await supabase
    .from("blogs")
    .select("id, title, slug, cover_image, excerpt, created_at, tags, category")
    .eq("status", "published")
    .neq("id", currentId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (!allBlogs || allBlogs.length === 0) {
    return null;
  }

  // Scoring algorithm:
  // Same category = +2 points
  // Same tag = +1 point per tag
  const scoredBlogs = allBlogs.map(b => {
    let score = 0;
    if (b.category === category) score += 2;
    
    const blogTags = b.tags || [];
    tags.forEach(tag => {
      if (blogTags.includes(tag)) score += 1;
    });

    return { ...b, _score: score };
  });

  // Sort by score descending. If scores are equal, fallback to newest first.
  scoredBlogs.sort((a, b) => b._score - a._score);

  // Take top 3
  const topMatches = scoredBlogs.slice(0, 3);

  if (topMatches.length === 0) return null;

  return (
    <section className="border-t border-border mt-16 pt-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center sm:text-left">
        More articles you might like
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topMatches.map((b) => (
          <GridBlogCard
            key={b.id}
            post={{
              slug: b.slug,
              author: "BlogHut Author",
              date: new Date(b.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
              title: b.title,
              excerpt: b.excerpt,
              tags: b.tags || [],
              imgSeed: b.cover_image || "a",
            }}
          />
        ))}
      </div>
    </section>
  );
}
