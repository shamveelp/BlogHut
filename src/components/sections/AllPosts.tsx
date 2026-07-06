"use client";

import { useState } from "react";
import { GridBlogCard, type BlogPost } from "@/components/blog/BlogCards";

const imgSeeds = ["e", "f", "a", "b", "c", "d", "e", "f", "a"];

const allPosts: BlogPost[] = [
  { slug: "bill-walsh-leadership", author: "Alec Whitten", date: "1 Jan 2023", title: "Bill Walsh leadership lessons", excerpt: "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?", tags: ["Leadership", "Management"] },
  { slug: "pm-mental-models", author: "Demi Wilkinson", date: "1 Jan 2023", title: "PM mental models", excerpt: "Mental models are simple expressions of complex processes or relationships.", tags: ["Product", "Research", "Frameworks"] },
  { slug: "what-is-wireframing", author: "Candice Wu", date: "1 Jan 2023", title: "What is Wireframing?", excerpt: "Introduction to Wireframing and its Principles. Learn from the best in the industry.", tags: ["Design", "Research"] },
  { slug: "collaboration-better-designers", author: "Natali Craig", date: "1 Jan 2023", title: "How collaboration makes us better designers", excerpt: "Collaboration can make our teams stronger, and our individual designs better.", tags: ["Design", "Research"] },
  { slug: "top-10-javascript-frameworks", author: "Drew Cano", date: "1 Jan 2023", title: "Our top 10 Javascript frameworks to use", excerpt: "JavaScript frameworks make development easy with extensive features and functionalities.", tags: ["Software Development", "Tech", "SaaS"] },
  { slug: "podcast-cx-community", author: "Orlando Diggs", date: "1 Jan 2023", title: "Podcast: Creating a better CX Community", excerpt: "Starting a community doesn't need to be complicated, but how do you get started?", tags: ["Podcasts", "Customer Success"] },
];

const POSTS_PER_PAGE = 6;
const TOTAL_PAGES = 10;

export default function AllPosts() {
  const [page, setPage] = useState(1);

  const pageNums = [1, 2, 3, "...", 8, 9, 10];

  return (
    <section className="mt-12 sm:mt-16 mb-24" aria-label="All blog posts">
      <div className="max-w-[1200px] mx-auto px-8">
        <h2 className="text-lg font-semibold tracking-tight text-foreground mb-8">All blog posts</h2>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 border-t border-border pt-8 mb-16" role="list">
          {allPosts.map((post, i) => (
            <li key={post.slug}>
              <GridBlogCard post={{ ...post, imgSeed: imgSeeds[i % imgSeeds.length] }} />
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-5 border-t border-border flex-wrap gap-4" role="navigation" aria-label="Pagination">
          <button
            className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-1 hidden sm:flex">
            {pageNums.map((n, i) =>
              n === "..." ? (
                <span key={`ellipsis-${i}`} className="px-3 text-muted">…</span>
              ) : (
                <button
                  key={n}
                  className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${page === n ? "bg-[rgba(255,255,255,0.05)] text-foreground" : "text-muted hover:text-foreground hover:bg-[rgba(255,255,255,0.03)]"}`}
                  onClick={() => setPage(n as number)}
                  aria-label={`Page ${n}`}
                  aria-current={page === n ? "page" : undefined}
                >
                  {n}
                </button>
              )
            )}
          </div>

          <button
            className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
            disabled={page === TOTAL_PAGES}
            aria-label="Next page"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
