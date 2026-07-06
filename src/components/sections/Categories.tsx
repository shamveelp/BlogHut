import Link from "next/link";

const categories = [
  { label: "Technology", icon: "⚡", count: 2840, slug: "technology", color: "var(--cat-blue)" },
  { label: "Design", icon: "🎨", count: 1230, slug: "design", color: "var(--cat-purple)" },
  { label: "Science", icon: "🔬", count: 980, slug: "science", color: "var(--cat-teal)" },
  { label: "Culture", icon: "🌍", count: 760, slug: "culture", color: "var(--cat-orange)" },
  { label: "Business", icon: "📈", count: 1450, slug: "business", color: "var(--cat-green)" },
  { label: "Health", icon: "💚", count: 620, slug: "health", color: "var(--cat-pink)" },
];

export default function Categories() {
  return (
    <section className="categories" aria-label="Browse categories">
      <div className="section-container">
        <div className="section-header">
          <div className="section-eyebrow">Browse by Topic</div>
          <h2 className="section-title">Find Your Niche</h2>
          <p className="section-subtitle">
            From deep tech dives to lifestyle reflections — there&apos;s something for every curious mind.
          </p>
        </div>

        <ul className="categories__grid" role="list">
          {categories.map(({ label, icon, count, slug, color }) => (
            <li key={slug}>
              <Link
                href={`/categories/${slug}`}
                className="category-card"
                style={{ "--cat-color": color } as React.CSSProperties}
              >
                <span className="category-card__icon" aria-hidden="true">{icon}</span>
                <span className="category-card__label">{label}</span>
                <span className="category-card__count">{count.toLocaleString()} articles</span>
                <div className="category-card__arrow" aria-hidden="true">→</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
