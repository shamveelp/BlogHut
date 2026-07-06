import { LargeBlogCard, SmallBlogCard, WideBlogCard, type BlogPost } from "@/components/blog/BlogCards";

const recent: BlogPost[] = [
  {
    slug: "ux-review-presentations",
    author: "Olivia Rhys",
    date: "1 Jan 2023",
    title: "UX review presentations",
    excerpt: "How do you create compelling presentations that wow your colleagues and impress your managers?",
    tags: ["Design", "Research", "Presentation"],
    imgSeed: "a",
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
  },
];

export default function RecentPosts() {
  const [large, ...rest] = recent;
  const small = rest.slice(0, 2);
  const wide = rest[2];

  return (
    <section className="mt-12 sm:mt-16 mb-16" aria-label="Recent blog posts">
      <div className="max-w-[1200px] mx-auto px-8">
        <h2 className="text-lg font-semibold tracking-tight text-foreground mb-8">Recent blog posts</h2>

        {/* Row 1: large left + 2 small right */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 mb-6">
          <LargeBlogCard post={large} />
          
          <div className="flex flex-col gap-6">
            {small.map((post) => (
              <SmallBlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        {/* Row 2: wide dark card left + 1 card right */}
        {wide && (
          <div className="grid grid-cols-1 gap-6 mb-6">
            <WideBlogCard post={wide} />
          </div>
        )}
      </div>
    </section>
  );
}
