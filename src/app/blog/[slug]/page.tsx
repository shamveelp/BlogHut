import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BlogTag, PostImage } from "@/components/blog/BlogCards";
import SimilarBlogs from "@/components/blog/SimilarBlogs";

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !blog) {
    console.error("BlogDetailsPage 404:", { slug, error, blog });
    notFound();
  }

  return (
    <article className="min-h-screen pt-24 pb-32 max-w-[1200px] mx-auto px-4 sm:px-8">
      <div className="mb-8 max-w-[1000px]">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-foreground transition-colors mb-10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to home
        </Link>

        {/* Header matching user design */}
        <header className="flex flex-col gap-4">
          <div className="text-[#8e75ff] font-semibold text-sm uppercase tracking-wide">
            {new Date(blog.created_at).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            {blog.title}
          </h1>
        </header>
      </div>

      {/* Cover Image */}
      <div className="w-full mb-16">
        <div className="w-full aspect-[16/9] md:aspect-[21/9] sm:rounded-2xl overflow-hidden shadow-2xl relative bg-card">
          <PostImage seed={blog.cover_image || "a"} alt={blog.title} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[800px]">
        {blog.excerpt && (
          <p className="text-xl sm:text-2xl text-foreground font-medium leading-relaxed mb-10 border-l-4 border-muted pl-6 italic">
            {blog.excerpt}
          </p>
        )}
        
        <div 
          className="prose prose-lg dark:prose-invert prose-p:leading-loose prose-p:text-dim prose-headings:text-foreground max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

      </div>

      {/* Similar Blogs Section */}
      <SimilarBlogs 
        currentId={blog.id} 
        category={blog.category} 
        tags={blog.tags || []} 
      />
    </article>
  );
}
