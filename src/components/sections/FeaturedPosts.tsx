import Link from "next/link";

const posts = [
  {
    id: 1,
    slug: "future-of-ai-2026",
    title: "The Future of AI: What 2026 Holds for Machine Learning",
    excerpt: "As large language models evolve, the boundaries between human and machine creativity blur in fascinating ways...",
    category: "Technology",
    readTime: "6 min read",
    date: "July 5, 2026",
    author: { name: "Sarah Chen", initials: "SC" },
    featured: true,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: 2,
    slug: "design-systems-at-scale",
    title: "Building Design Systems That Actually Scale",
    excerpt: "After working with Fortune 500 companies, here are the design principles that separate good systems from great ones...",
    category: "Design",
    readTime: "9 min read",
    date: "July 3, 2026",
    author: { name: "Marcus Lee", initials: "ML" },
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: 3,
    slug: "quantum-computing-beginners",
    title: "Quantum Computing for the Absolute Beginner",
    excerpt: "Qubits, superposition, entanglement — demystified with zero math prerequisites required...",
    category: "Science",
    readTime: "12 min read",
    date: "July 1, 2026",
    author: { name: "Dr. Priya Nair", initials: "PN" },
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: 4,
    slug: "remote-work-culture",
    title: "How Remote Work Rewired Our Relationship with Time",
    excerpt: "Three years in, we are only beginning to understand the full psychological shift remote work has triggered...",
    category: "Culture",
    readTime: "7 min read",
    date: "June 28, 2026",
    author: { name: "Alex Rivera", initials: "AR" },
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  {
    id: 5,
    slug: "startup-growth-hacking",
    title: "Growth Hacking Is Dead. Long Live Growth Engineering",
    excerpt: "The era of cheap tricks is over. Here is why sustainable engineering-led growth is the only path forward...",
    category: "Business",
    readTime: "5 min read",
    date: "June 25, 2026",
    author: { name: "Nina Osei", initials: "NO" },
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    id: 6,
    slug: "mindful-tech-habits",
    title: "Digital Minimalism: Reclaiming Focus in a Noisy World",
    excerpt: "Practical strategies to reduce screen fatigue and build intentional relationships with your devices...",
    category: "Health",
    readTime: "8 min read",
    date: "June 22, 2026",
    author: { name: "Tom Walker", initials: "TW" },
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  },
];

export default function FeaturedPosts() {
  const [featured, ...rest] = posts;

  return (
    <section className="featured-posts" aria-label="Featured posts">
      <div className="section-container">
        <div className="section-header">
          <div className="section-eyebrow">Editor&apos;s Picks</div>
          <h2 className="section-title">Trending This Week</h2>
        </div>

        {/* Feature card — large */}
        <Link href={`/blog/${featured.slug}`} className="post-feature-card" aria-label={featured.title}>
          <div className="post-feature-card__visual" style={{ background: featured.gradient }} aria-hidden="true">
            <div className="post-feature-card__overlay" />
            <span className="post-feature-card__category">{featured.category}</span>
          </div>
          <div className="post-feature-card__body">
            <h3 className="post-feature-card__title">{featured.title}</h3>
            <p className="post-feature-card__excerpt">{featured.excerpt}</p>
            <div className="post-card__meta">
              <div className="post-card__avatar">{featured.author.initials}</div>
              <div>
                <div className="post-card__author">{featured.author.name}</div>
                <div className="post-card__date">{featured.date} · {featured.readTime}</div>
              </div>
            </div>
          </div>
        </Link>

        {/* Grid of remaining cards */}
        <ul className="posts-grid" role="list">
          {rest.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className="post-card" aria-label={post.title}>
                <div
                  className="post-card__thumbnail"
                  style={{ background: post.gradient }}
                  aria-hidden="true"
                >
                  <span className="post-card__category-badge">{post.category}</span>
                </div>
                <div className="post-card__body">
                  <h3 className="post-card__title">{post.title}</h3>
                  <p className="post-card__excerpt">{post.excerpt}</p>
                  <div className="post-card__meta">
                    <div className="post-card__avatar">{post.author.initials}</div>
                    <div>
                      <div className="post-card__author">{post.author.name}</div>
                      <div className="post-card__date">{post.date} · {post.readTime}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="featured-posts__cta">
          <Link href="/blog" className="hero__btn hero__btn--ghost">
            View All Articles
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
