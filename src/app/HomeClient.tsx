"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { GridBlogCard, LargeBlogCard, SmallBlogCard, WideBlogCard } from "@/components/blog/BlogCards";

const ITEMS_PER_PAGE = 10;

export default function HomeClient() {
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchBlogs() {
      setIsLoading(true);
      
      let dbQuery = supabase
        .from("blogs")
        .select("*", { count: "exact" })
        .eq("status", "published");

      // Pagination
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      dbQuery = dbQuery.order("created_at", { ascending: false }).range(from, to);

      const { data, count, error } = await dbQuery;
      
      if (!error && data) {
        setBlogs(data);
        if (count !== null) setTotalCount(count);
      } else if (error) {
        console.error("Home Fetch Error:", error);
      }
      setIsLoading(false);
    }

    fetchBlogs();
  }, [page, supabase]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <section className="mt-12 sm:mt-16 mb-24" aria-label="Blog posts">
      <div className="max-w-[1200px] mx-auto px-8">
        
        {/* Results State */}
        <div className="mb-6 flex justify-between items-center text-sm text-muted">
          <span>{isLoading ? "Loading..." : `Showing ${blogs.length} of ${totalCount} articles`}</span>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50 pointer-events-none">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-card rounded-2xl aspect-[4/5] animate-pulse border border-border/50"></div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          (() => {
            const isNormalTime = page === 1 && blogs.length >= 4;
            const formattedBlogs = blogs.map(blog => ({
              id: blog.id,
              slug: blog.slug,
              author: "BlogHut Author",
              date: new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
              title: blog.title,
              excerpt: blog.excerpt,
              tags: blog.tags || [],
              imgSeed: blog.cover_image || "a",
            }));

            if (isNormalTime) {
              const [large, small1, small2, wide, ...rest] = formattedBlogs;
              return (
                <>
                  <div className="mb-12">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground mb-8">Recent blog posts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 mb-6">
                      <LargeBlogCard post={large} />
                      <div className="flex flex-col gap-6">
                        <SmallBlogCard post={small1} />
                        <SmallBlogCard post={small2} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <WideBlogCard post={wide} />
                    </div>
                  </div>
                  
                  {rest.length > 0 && (
                    <>
                      <h2 className="text-lg font-semibold tracking-tight text-foreground mb-6">All blog posts</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rest.map(post => (
                          <GridBlogCard key={post.id} post={post} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formattedBlogs.map(post => (
                  <GridBlogCard key={post.id} post={post} />
                ))}
              </div>
            );
          })()
        ) : (
          <div className="py-32 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-card/50">
            <h3 className="text-2xl font-bold text-foreground mb-2">No articles found</h3>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-16 pt-8 border-t border-border flex justify-center items-center gap-4">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-border text-foreground hover:bg-muted/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            
            <span className="text-sm font-semibold text-muted">
              Page {page} of {totalPages}
            </span>

            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-border text-foreground hover:bg-muted/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
