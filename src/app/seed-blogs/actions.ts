"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const REALISTIC_BLOGS = [
  {
    title: "10 Principles of Modern Web Design in 2026",
    slug: "10-principles-modern-web-design-2026",
    category: "Design",
    tags: ["UI/UX", "Trends", "Web"],
    excerpt: "Explore the cutting-edge principles that are shaping the interfaces of tomorrow, from spatial UI to AI-driven layouts.",
    content: "<h2>The Evolution of Interfaces</h2><p>As we move deeper into the decade, web design has shifted drastically from flat design to rich, immersive experiences...</p><h3>1. Spatial UI</h3><p>Taking cues from AR/VR environments, web interfaces now use depth and layering extensively.</p><h3>2. Micro-interactions</h3><p>The web feels more alive than ever...</p>",
    cover_image: "design_trends_2026",
    status: "published"
  },
  {
    title: "The Ultimate Guide to React Server Components",
    slug: "ultimate-guide-react-server-components",
    category: "Frameworks",
    tags: ["React", "Next.js", "Performance"],
    excerpt: "Confused about when to use 'use client' and 'use server'? This comprehensive guide breaks down React Server Components.",
    content: "<h2>Understanding the Paradigm Shift</h2><p>React Server Components (RSC) represent one of the biggest architectural shifts in frontend development.</p><p>By default, components now render on the server, sending zero JavaScript to the client. This dramatically improves initial load times...</p>",
    cover_image: "react_server_components",
    status: "published"
  },
  {
    title: "Building Scalable SaaS Architectures",
    slug: "building-scalable-saas-architectures",
    category: "SaaS",
    tags: ["Architecture", "Backend", "Scaling"],
    excerpt: "Learn how to structure your backend to handle millions of requests without breaking a sweat or your bank account.",
    content: "<h2>The Monolith vs Microservices Debate</h2><p>When starting a SaaS, the instinct is often to over-engineer. However, a well-structured modular monolith is usually the best starting point.</p><p>In this article, we explore how to split your database routing, handle multi-tenancy, and scale horizontally when the time comes.</p>",
    cover_image: "scalable_saas",
    status: "published"
  },
  {
    title: "Mastering TypeScript: Advanced Type Inference",
    slug: "mastering-typescript-advanced-type-inference",
    category: "Software Development",
    tags: ["TypeScript", "Coding", "Advanced"],
    excerpt: "Stop using 'any' and start leveraging the true power of TypeScript's type system with conditional and mapped types.",
    content: "<h2>Beyond the Basics</h2><p>TypeScript is easy to learn but hard to master. Once you move past basic interfaces, you discover a world of type programming.</p><pre><code>type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;</code></pre><p>This simple generic allows you to extract the resolved type of a Promise...</p>",
    cover_image: "typescript_mastery",
    status: "published"
  },
  {
    title: "Effective Engineering Management",
    slug: "effective-engineering-management",
    category: "Management",
    tags: ["Leadership", "Teams", "Agile"],
    excerpt: "Transitioning from a senior developer to an engineering manager requires a complete shift in perspective and skills.",
    content: "<h2>Your Output is Your Team's Output</h2><p>As a developer, your value is measured by the code you write. As a manager, your value is measured by the code your team writes.</p><p>This means your primary job is unblocking your team, shielding them from noise, and guiding their career progression.</p>",
    cover_image: "engineering_management",
    status: "published"
  },
  {
    title: "Why Minimalist Interfaces Convert Better",
    slug: "why-minimalist-interfaces-convert-better",
    category: "Interface",
    tags: ["UI/UX", "Conversion", "Design"],
    excerpt: "A deep dive into the psychology of whitespace and why stripping away features often leads to higher user engagement.",
    content: "<h2>The Paradox of Choice</h2><p>When presented with too many options, users experience decision fatigue. A minimalist interface forces the designer to prioritize the primary call to action.</p><p>By increasing whitespace and reducing visual clutter, cognitive load decreases, allowing users to flow through your application effortlessly.</p>",
    cover_image: "minimalist_ui",
    status: "published"
  },
  {
    title: "The Rise of Edge Computing in Next.js",
    slug: "rise-of-edge-computing-nextjs",
    category: "Tech",
    tags: ["Next.js", "Edge", "Performance"],
    excerpt: "How Vercel and Next.js are pushing computation closer to the user for sub-50ms response times globally.",
    content: "<h2>What is the Edge?</h2><p>Traditionally, your server lived in one specific region (e.g., US-East). If a user from Tokyo accessed your site, they experienced latency.</p><p>Edge computing deploys your serverless functions across a global network, meaning the code executes in the data center physically closest to the user.</p>",
    cover_image: "edge_computing",
    status: "published"
  },
  {
    title: "Customer Success: The New Sales",
    slug: "customer-success-the-new-sales",
    category: "Customer Success",
    tags: ["SaaS", "Retention", "Business"],
    excerpt: "Acquiring a user is only 10% of the battle. Here is how modern SaaS companies use Customer Success to drive negative churn.",
    content: "<h2>Retention is King</h2><p>In a subscription model, losing a customer means losing recurring revenue. Customer Success is not customer support; it's proactive.</p><p>By ensuring users achieve their desired outcomes using your software, you guarantee renewals and generate powerful upsell opportunities.</p>",
    cover_image: "customer_success",
    status: "published"
  },
  {
    title: "Top 5 Podcasts for Tech Founders",
    slug: "top-5-podcasts-for-tech-founders",
    category: "Podcasts",
    tags: ["Startup", "Audio", "Learning"],
    excerpt: "Commuting or working out? Here are the top 5 podcasts every tech founder should be listening to right now.",
    content: "<h2>Fueling Your Brain</h2><p>Running a startup is a lonely journey, but listening to others who have walked the path makes it easier.</p><ul><li><strong>My First Million:</strong> Brainstorming brilliant business ideas.</li><li><strong>How I Built This:</strong> Deep dives into massive companies.</li><li><strong>Lenny's Podcast:</strong> Incredible product management insights.</li></ul>",
    cover_image: "tech_podcasts",
    status: "published"
  },
  {
    title: "Giving Perfect Presentations to Stakeholders",
    slug: "giving-perfect-presentations-stakeholders",
    category: "Presentation",
    tags: ["Communication", "Soft Skills", "Business"],
    excerpt: "How to distill complex technical architecture into presentations that non-technical stakeholders will actually understand.",
    content: "<h2>Know Your Audience</h2><p>Your CEO doesn't care about the Big-O notation of your new algorithm. They care about how it impacts revenue, speed, and reliability.</p><p>When presenting technical concepts, always anchor them to business value. Use analogies, limit text on slides, and focus on the narrative.</p>",
    cover_image: "presentations",
    status: "published"
  },
  {
    title: "Understanding CSS Grid vs Flexbox",
    slug: "understanding-css-grid-vs-flexbox",
    category: "Design",
    tags: ["CSS", "Frontend", "Layouts"],
    excerpt: "Stop guessing which one to use. A definitive guide on when to use Grid (2D layouts) versus Flexbox (1D layouts).",
    content: "<h2>The Golden Rule</h2><p>Use Flexbox when you want to layout items in a single row or a single column. Use Grid when you need a complex two-dimensional layout.</p><p>Grid allows you to define strict columns and rows, whereas Flexbox is content-driven, allowing items to push and stretch organically.</p>",
    cover_image: "css_grid_flexbox",
    status: "published"
  },
  {
    title: "The Future of Open Source SaaS",
    slug: "future-of-open-source-saas",
    category: "SaaS",
    tags: ["Open Source", "Business Models", "Startups"],
    excerpt: "Why commercial open source software (COSS) is disrupting traditional proprietary enterprise software.",
    content: "<h2>Trust and Transparency</h2><p>Enterprise companies are increasingly wary of vendor lock-in. Open source SaaS provides an escape hatch.</p><p>Companies like Supabase, Cal.com, and PostHog are proving that you can build massive, profitable businesses while keeping your core repository completely open.</p>",
    cover_image: "open_source_saas",
    status: "published"
  },
  {
    title: "Database Indexing Strategies for Postgres",
    slug: "database-indexing-strategies-postgres",
    category: "Software Development",
    tags: ["Database", "Postgres", "Performance"],
    excerpt: "A slow query can bring down your entire application. Learn how B-Trees, Hash, and GIN indexes work under the hood.",
    content: "<h2>Stop Doing Sequential Scans</h2><p>When you query a database without an index, the engine scans every single row. As your data grows, this becomes unacceptably slow.</p><p>By creating a B-Tree index on frequently queried columns, the database can find records logarithmically, drastically reducing lookup times.</p>",
    cover_image: "postgres_indexes",
    status: "published"
  },
  {
    title: "Designing for Dark Mode: Common Mistakes",
    slug: "designing-for-dark-mode-common-mistakes",
    category: "Interface",
    tags: ["Dark Mode", "UI/UX", "Colors"],
    excerpt: "Dark mode isn't just about inverting colors. Learn how to manage contrast, elevation, and saturation correctly.",
    content: "<h2>Pure Black is a Mistake</h2><p>Using #000000 as your background creates severe eye strain when contrasted with white text. Instead, use dark grays like #121212.</p><p>Furthermore, colors need to be desaturated in dark mode to prevent them from visually vibrating against the dark background.</p>",
    cover_image: "dark_mode_design",
    status: "published"
  },
  {
    title: "How to Run Effective 1-on-1s",
    slug: "how-to-run-effective-1-on-1s",
    category: "Management",
    tags: ["Leadership", "Communication", "Culture"],
    excerpt: "A 1-on-1 is the most important meeting on a manager's calendar. Here is how to ensure it is actually valuable.",
    content: "<h2>It's Their Meeting, Not Yours</h2><p>A 1-on-1 is not a status update. It is a dedicated time for the report to discuss career goals, blockers, and frustrations.</p><p>Ask open-ended questions like 'What is the most frustrating part of your week?' and listen more than you speak.</p>",
    cover_image: "management_1on1",
    status: "published"
  },
  {
    title: "Rust for JavaScript Developers",
    slug: "rust-for-javascript-developers",
    category: "Tech",
    tags: ["Rust", "JavaScript", "WebAssembly"],
    excerpt: "Why so many JS tools are being rewritten in Rust, and how you can get started learning it today.",
    content: "<h2>The Need for Speed</h2><p>Tools like SWC, Turbopack, and Rome are incredibly fast because they are written in Rust, a systems language with no garbage collector.</p><p>While the borrow checker has a steep learning curve, understanding Rust will make you a better programmer overall.</p>",
    cover_image: "rust_for_js",
    status: "published"
  },
  {
    title: "Building a Component Library from Scratch",
    slug: "building-component-library-from-scratch",
    category: "Frameworks",
    tags: ["React", "Storybook", "Design System"],
    excerpt: "The architectural decisions you need to make before building an internal React component library for your company.",
    content: "<h2>Consistency is Key</h2><p>A component library ensures that every button, input, and modal looks exactly the same across your entire ecosystem.</p><p>We will explore how to use tools like Storybook for documentation and Tailwind for headless styling APIs.</p>",
    cover_image: "component_library",
    status: "published"
  },
  {
    title: "Product-Led Growth Explained",
    slug: "product-led-growth-explained",
    category: "Product",
    tags: ["PLG", "Growth", "Startups"],
    excerpt: "How companies like Slack and Notion use their own product as the primary driver of user acquisition and expansion.",
    content: "<h2>Show, Don't Tell</h2><p>In a sales-led model, a user has to talk to a rep before seeing the product. In Product-Led Growth (PLG), the product sells itself.</p><p>By offering a generous free tier and focusing heavily on time-to-value, users invite their colleagues, causing viral internal growth.</p>",
    cover_image: "plg_growth",
    status: "published"
  },
  {
    title: "The Anatomy of a Great Tech Talk",
    slug: "anatomy-of-great-tech-talk",
    category: "Presentation",
    tags: ["Public Speaking", "Community", "Conferences"],
    excerpt: "Nervous about speaking at a conference? Here is a structured approach to writing and delivering an engaging tech talk.",
    content: "<h2>Start with the 'Why'</h2><p>Don't just show code on a screen. Tell a story about a problem you faced, the pain it caused, and how your technical solution resolved it.</p><p>Live coding is risky but rewarding; always have a backup video just in case the WiFi fails.</p>",
    cover_image: "tech_talks",
    status: "published"
  },
  {
    title: "Mastering the Tailwind Grid System",
    slug: "mastering-tailwind-grid-system",
    category: "Design",
    tags: ["Tailwind", "CSS", "Frontend"],
    excerpt: "Moving beyond basic flexbox layouts to create stunning, responsive, magazine-style web pages using Tailwind Grid.",
    content: "<h2>Unlocking Grid-Cols</h2><p>Tailwind makes CSS grid accessible. By defining `grid-cols-12`, you can span items across columns just like a traditional print layout.</p><p>Combine `col-span-x` with responsive prefixes like `md:` and `lg:` to completely reflow your application based on screen size.</p>",
    cover_image: "tailwind_grid",
    status: "published"
  }
];

export async function seedRealisticBlogs() {
  const supabase = await createSupabaseServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "You must be logged in to seed the database!" };
  }

  const blogsToInsert = REALISTIC_BLOGS.map(blog => ({
    ...blog,
    author_id: user.id,
    created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString() // Randomize dates slightly in the past
  }));

  const { error } = await supabase.from("blogs").insert(blogsToInsert);

  if (error) {
    console.error("Error seeding:", error);
    return { error: error.message };
  }

  return { success: true };
}
