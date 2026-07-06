"use client";

import { useState } from "react";
import Link from "next/link";

const TAG_COLORS: Record<string, string> = {
  Design: "#f97316",
  Research: "#3b82f6",
  Presentation: "#22c55e",
  Interface: "#6366f1",
  Leadership: "#3b82f6",
  Management: "#71717a",
  Product: "#a855f7",
  Frameworks: "#22c55e",
  Tech: "#14b8a6",
  Podcasts: "#ec4899",
  "Customer Success": "#f59e0b",
  "Software Development": "#06b6d4",
  SaaS: "#a855f7",
};

function Tag({ label }: { label: string }) {
  const color = TAG_COLORS[label] ?? "#6b7280";
  return (
    <span className="post-tag" style={{ background: color + "22", color, borderColor: color + "44" }}>
      {label}
    </span>
  );
}

const imgSeeds = ["e", "f", "a", "b", "c", "d", "e", "f", "a"];

const allPosts = [
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
    <section className="all-posts" aria-label="All blog posts">
      <div className="posts-container">
        <h2 className="posts-section-label">All blog posts</h2>

        <ul className="all-posts__grid" role="list">
          {allPosts.map((post, i) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="grid-post-card">
                <div
                  className="grid-post-card__img"
                  style={{ background: `var(--img-${imgSeeds[i % imgSeeds.length]})` }}
                  role="img"
                  aria-label={post.title}
                />
                <div className="grid-post-card__body">
                  <div className="post-meta">{post.author} • {post.date}</div>
                  <div className="post-title-row">
                    <h3 className="post-title post-title--md">{post.title}</h3>
                    <span className="post-arrow" aria-hidden="true">↗</span>
                  </div>
                  <p className="post-excerpt post-excerpt--sm">{post.excerpt}</p>
                  <div className="post-tags">
                    {post.tags.map((t) => <Tag key={t} label={t} />)}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="pagination" role="navigation" aria-label="Pagination">
          <button
            className="pagination__btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            ← Previous
          </button>

          <div className="pagination__pages">
            {pageNums.map((n, i) =>
              n === "..." ? (
                <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
              ) : (
                <button
                  key={n}
                  className={`pagination__page ${page === n ? "active" : ""}`}
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
            className="pagination__btn"
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
