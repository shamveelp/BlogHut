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
    <span className="text-xs font-semibold tracking-[0.01em] px-2.5 py-1 rounded-full border" style={{ background: color + "22", color, borderColor: color + "44" }}>
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
      className="w-full h-full relative overflow-hidden rounded-lg group-hover:opacity-90 transition-opacity"
      style={{ background: gradients[seed] ?? gradients.a }}
      role="img"
      aria-label={alt}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
    <section className="mb-16" aria-label="Recent blog posts">
      <div className="max-w-[1200px] mx-auto px-8">
        <h2 className="text-lg font-semibold tracking-tight text-foreground mb-6">Recent blog posts</h2>

        {/* Row 1: large left + 2 small right */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 mb-6">
          {/* Large card */}
          <Link href={`/blog/${large.slug}`} className="flex flex-col group md:border-r border-border md:pr-6">
            <div className="h-[320px] mb-5">
              <PostImage seed={large.imgSeed} alt={large.title} />
            </div>
            <div className="flex flex-col">
              <div className="text-[13px] text-muted mb-2">{large.author} • {large.date}</div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-muted transition-colors">{large.title}</h3>
                <span className="text-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true">↗</span>
              </div>
              <p className="text-[15px] text-dim leading-relaxed">{large.excerpt}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {large.tags.map((t) => <Tag key={t} label={t} />)}
              </div>
            </div>
          </Link>

          {/* 2 small cards stacked */}
          <div className="flex flex-col gap-6">
            {small.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="flex flex-col sm:grid sm:grid-cols-[140px_1fr] gap-5 group">
                <div className="h-[200px] sm:h-auto">
                  <PostImage seed={post.imgSeed} alt={post.title} />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-[13px] text-muted mb-2">{post.author} • {post.date}</div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-muted transition-colors">{post.title}</h3>
                    <span className="text-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true">↗</span>
                  </div>
                  <p className="text-[14px] text-dim leading-snug">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map((t) => <Tag key={t} label={t} />)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Row 2: wide dark card left + 1 card right */}
        {wide && (
          <div className="grid grid-cols-1 gap-6 mb-6">
            <Link href={`/blog/${wide.slug}`} className="group block relative overflow-hidden rounded-xl bg-card border border-border">
              <div className="w-full h-[360px] relative">
                <PostImage seed={wide.imgSeed} alt={wide.title} />
                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="text-[13px] text-white/75 mb-2">{wide.author} • {wide.date}</div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-white/80 transition-colors">{wide.title}</h3>
                    <span className="text-white transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true">↗</span>
                  </div>
                  <p className="text-[15px] text-white/80 leading-relaxed max-w-2xl">{wide.excerpt}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
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
