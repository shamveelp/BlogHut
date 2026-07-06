import Link from "next/link";

export interface BlogPost {
  slug: string;
  author: string;
  date: string;
  title: string;
  excerpt: string;
  tags: string[];
  imgSeed?: string;
}

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

export function BlogTag({ label }: { label: string }) {
  const color = TAG_COLORS[label] ?? "#6b7280";
  return (
    <span className="text-xs font-semibold tracking-[0.01em] px-2.5 py-1 rounded-full border" style={{ background: color + "22", color, borderColor: color + "44" }}>
      {label}
    </span>
  );
}

export function PostImage({ seed, alt }: { seed: string; alt: string }) {
  const isUrl = seed.startsWith("http");
  return (
    <div
      className="w-full h-full relative overflow-hidden rounded-lg group-hover:opacity-90 transition-opacity"
      style={!isUrl ? { background: `var(--img-${seed || "a"})` } : {}}
      role="img"
      aria-label={alt}
    >
      {isUrl && (
        <img src={seed} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}

export function LargeBlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="flex flex-col group md:border-r border-border md:pr-6 h-full">
      <div className="h-[320px] mb-5">
        <PostImage seed={post.imgSeed || "a"} alt={post.title} />
      </div>
      <div className="flex flex-col flex-1">
        <div className="text-[13px] text-muted mb-2">{post.author} • {post.date}</div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-muted transition-colors">{post.title}</h3>
          <span className="text-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true">↗</span>
        </div>
        <p className="text-[15px] text-dim leading-relaxed mb-4">{post.excerpt}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {post.tags.map((t) => <BlogTag key={t} label={t} />)}
        </div>
      </div>
    </Link>
  );
}

export function SmallBlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="flex flex-col sm:grid sm:grid-cols-[140px_1fr] gap-5 group">
      <div className="h-[200px] sm:h-[120px] w-full shrink-0">
        <PostImage seed={post.imgSeed || "a"} alt={post.title} />
      </div>
      <div className="flex flex-col justify-center">
        <div className="text-[13px] text-muted mb-2">{post.author} • {post.date}</div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-muted transition-colors leading-snug">{post.title}</h3>
          <span className="text-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 shrink-0" aria-hidden="true">↗</span>
        </div>
        <p className="text-[14px] text-dim leading-snug mb-3 line-clamp-2">{post.excerpt}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {post.tags.map((t) => <BlogTag key={t} label={t} />)}
        </div>
      </div>
    </Link>
  );
}

export function WideBlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block relative overflow-hidden rounded-xl bg-card border border-border">
      <div className="w-full h-[360px] relative">
        <PostImage seed={post.imgSeed || "a"} alt={post.title} />
        <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div className="text-[13px] text-white/80 mb-2">{post.author} • {post.date}</div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-white/80 transition-colors">{post.title}</h3>
            <span className="text-white transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true">↗</span>
          </div>
          <p className="text-[15px] text-white/80 leading-relaxed max-w-2xl">{post.excerpt}</p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {post.tags.map((t) => <BlogTag key={t} label={t} />)}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function GridBlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="flex flex-col group h-full">
      <div className="w-full h-[240px] mb-5 shrink-0">
        <PostImage seed={post.imgSeed || "a"} alt={post.title} />
      </div>
      <div className="flex flex-col flex-1">
        <div className="text-[13px] text-muted mb-2">{post.author} • {post.date}</div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-[20px] font-bold tracking-tight text-foreground group-hover:text-muted transition-colors leading-tight">{post.title}</h3>
          <span className="text-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 flex-shrink-0" aria-hidden="true">↗</span>
        </div>
        <p className="text-[14px] text-dim leading-relaxed mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {post.tags.map((t) => <BlogTag key={t} label={t} />)}
        </div>
      </div>
    </Link>
  );
}
