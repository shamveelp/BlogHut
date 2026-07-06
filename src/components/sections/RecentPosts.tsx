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
};

function Tag({ label }: { label: string }) {
  const color = TAG_COLORS[label] ?? "#6b7280";
  return (
    <span className="post-tag" style={{ background: color + "22", color, borderColor: color + "44" }}>
      {label}
    </span>
  );
}

function PostImage({ seed, alt }: { seed: string; alt: string }) {
  // editorial-style placeholder using CSS gradients
  const gradients: Record<string, string> = {
    a: "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
    b: "linear-gradient(135deg,#1e3a2f 0%,#2d5a3d 50%,#1a3a2a 100%)",
    c: "linear-gradient(135deg,#2d1b4e 0%,#4a2c6e 50%,#1e1035 100%)",
    d: "linear-gradient(135deg,#1a0a0a 0%,#3d1515 50%,#5c2020 100%)",
    e: "linear-gradient(135deg,#0a1628 0%,#1e3a5f 50%,#0d2137 100%)",
    f: "linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 50%,#3d3d3d 100%)",
  };
  return (
    <div
      className="post-img"
      style={{ background: gradients[seed] ?? gradients.a }}
      role="img"
      aria-label={alt}
    >
      <div className="post-img__overlay" />
    </div>
  );
}

const recent = [
  {
    slug: "ux-review-presentations",
    author: "Olivia Rhys",
    date: "1 Jan 2023",
    title: "UX review presentations",
    excerpt: "How do you create compelling presentations that wow your colleagues and impress your managers?",
    tags: ["Design", "Research", "Presentation"],
    imgSeed: "a",
    large: true,
  },
  {
    slug: "migrating-to-linear-101",
    author: "Phoenix Baker",
    date: "1 Jan 2023",
    title: "Migrating to Linear 101",
    excerpt: "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    tags: ["Design", "Research"],
    imgSeed: "b",
  },
  {
    slug: "building-your-api-stack",
    author: "Lana Steiner",
    date: "1 Jan 2023",
    title: "Building your API Stack",
    excerpt: "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    tags: ["Design", "Research"],
    imgSeed: "c",
  },
  {
    slug: "grid-system-design-user-interface",
    author: "Olivia Rhys",
    date: "1 Jan 2023",
    title: "Grid system for better Design User Interface",
    excerpt: "A grid system is a design tool used to arrange content on a webpage. It is a series of vertical and horizontal lines that create a matrix of intersecting points.",
    tags: ["Design", "Interface"],
    imgSeed: "d",
    wide: true,
  },
];

export default function RecentPosts() {
  const [large, ...rest] = recent;
  const small = rest.slice(0, 2);
  const wide = rest[2];

  return (
    <section className="recent-posts" aria-label="Recent blog posts">
      <div className="posts-container">
        <h2 className="posts-section-label">Recent blog posts</h2>

        {/* Row 1: large left + 2 small right */}
        <div className="recent-row recent-row--top">
          {/* Large card */}
          <Link href={`/blog/${large.slug}`} className="post-card-large">
            <PostImage seed={large.imgSeed} alt={large.title} />
            <div className="post-card-large__body">
              <div className="post-meta">{large.author} • {large.date}</div>
              <div className="post-title-row">
                <h3 className="post-title">{large.title}</h3>
                <span className="post-arrow" aria-hidden="true">↗</span>
              </div>
              <p className="post-excerpt">{large.excerpt}</p>
              <div className="post-tags">
                {large.tags.map((t) => <Tag key={t} label={t} />)}
              </div>
            </div>
          </Link>

          {/* 2 small cards stacked */}
          <div className="recent-stack">
            {small.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card-small">
                <PostImage seed={post.imgSeed} alt={post.title} />
                <div className="post-card-small__body">
                  <div className="post-meta">{post.author} • {post.date}</div>
                  <div className="post-title-row">
                    <h3 className="post-title post-title--sm">{post.title}</h3>
                    <span className="post-arrow" aria-hidden="true">↗</span>
                  </div>
                  <p className="post-excerpt post-excerpt--sm">{post.excerpt}</p>
                  <div className="post-tags">
                    {post.tags.map((t) => <Tag key={t} label={t} />)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Row 2: wide dark card left + 1 card right */}
        {wide && (
          <div className="recent-row recent-row--bottom">
            <Link href={`/blog/${wide.slug}`} className="post-card-wide">
              <div className="post-card-wide__img">
                <PostImage seed={wide.imgSeed} alt={wide.title} />
                <div className="post-card-wide__text-overlay">
                  <div className="post-meta post-meta--light">{wide.author} • {wide.date}</div>
                  <div className="post-title-row">
                    <h3 className="post-title post-title--overlay">{wide.title}</h3>
                    <span className="post-arrow post-arrow--light" aria-hidden="true">↗</span>
                  </div>
                  <p className="post-excerpt post-excerpt--light">{wide.excerpt}</p>
                  <div className="post-tags">
                    {wide.tags.map((t) => <Tag key={t} label={t} />)}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
