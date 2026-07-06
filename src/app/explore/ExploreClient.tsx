"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { GridBlogCard } from "@/components/blog/BlogCards";

const CATEGORIES = [
  "All",
  "Design", 
  "Tech", 
  "Leadership", 
  "Product", 
  "SaaS", 
  "Frameworks", 
  "Presentation", 
  "Interface", 
  "Management", 
  "Podcasts", 
  "Customer Success", 
  "Software Development"
];

const ITEMS_PER_PAGE = 9;

export default function ExploreClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Sync state if URL query changes (e.g. user searches again from navbar)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    setPage(1); // Reset page on new search
  }, [searchParams]);

  useEffect(() => {
    async function fetchBlogs() {
      setIsLoading(true);
      
      let dbQuery = supabase
        .from("blogs")
        .select("*", { count: "exact" })
        .eq("status", "published");

      if (query) {
        dbQuery = dbQuery.ilike("title", `%${query}%`);
      }

      if (category !== "All") {
        dbQuery = dbQuery.eq("category", category);
      }

      // Pagination
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      dbQuery = dbQuery.order("created_at", { ascending: false }).range(from, to);

      const { data, count, error } = await dbQuery;
      
      if (!error && data) {
        setBlogs(data);
        if (count !== null) setTotalCount(count);
      } else if (error) {
        console.error("Explore Fetch Error:", error);
      }
      setIsLoading(false);
    }

    fetchBlogs();
  }, [query, category, page, supabase]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      {/* Search Input for Explore Page */}
      <div className="mb-8 relative max-w-xl">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input 
          type="text" 
          placeholder="Filter by title..." 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-4 text-foreground focus:outline-none focus:border-muted transition-colors shadow-sm"
        />
        {query && (
          <button 
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-sm font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              category === cat 
                ? 'bg-foreground text-background border-foreground shadow-md' 
                : 'bg-card text-muted hover:text-foreground border-border hover:border-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results State */}
      <div className="mb-6 flex justify-between items-center text-sm text-muted">
        <span>{isLoading ? "Searching..." : `Showing ${blogs.length} of ${totalCount} articles`}</span>
        {query && !isLoading && (
          <span>Results for "{query}"</span>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50 pointer-events-none">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-card rounded-2xl aspect-[4/5] animate-pulse border border-border/50"></div>
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <GridBlogCard 
              key={blog.id}
              post={{
                slug: blog.slug,
                author: "BlogHut Author",
                date: new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
                title: blog.title,
                excerpt: blog.excerpt,
                tags: blog.tags || [],
                imgSeed: blog.cover_image || "a",
              }}
            />
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-card/50">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted/30 mb-6"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <h3 className="text-2xl font-bold text-foreground mb-2">No articles found</h3>
          <p className="text-muted text-center max-w-sm">
            We couldn't find any articles matching your current search or category filters. Try adjusting them!
          </p>
          <button 
            onClick={() => { setQuery(""); setCategory("All"); }}
            className="mt-6 px-6 py-3 bg-foreground text-background rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            Clear all filters
          </button>
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
  );
}
