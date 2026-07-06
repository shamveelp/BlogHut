import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BlogTag, PostImage } from "@/components/blog/BlogCards";

export default async function BlogDetailsPage({ params }: { params: { slug: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*, author:author_id(id, raw_user_meta_data)")
    .eq("slug", params.slug)
    .single();

  if (error || !blog) {
    notFound();
  }

  const authorName = blog.author?.raw_user_meta_data?.full_name || "Unknown Author";

  return (
    <article className="min-h-screen pt-24 pb-32">
      <div className="max-w-[800px] mx-auto px-6 sm:px-8">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-foreground transition-colors mb-10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to home
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.category && <BlogTag label={blog.category} />}
            {blog.tags?.map((t: string) => <BlogTag key={t} label={t} />)}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="font-semibold text-foreground">{authorName}</span>
            <span>•</span>
            <span>{new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>
      </div>

      {/* Cover Image */}
      <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-8 mb-16">
        <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl relative bg-card border border-border">
          <PostImage seed={blog.cover_image || "a"} alt={blog.title} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[700px] mx-auto px-6 sm:px-8">
        {blog.excerpt && (
          <p className="text-xl sm:text-2xl text-foreground font-medium leading-relaxed mb-10 border-l-4 border-muted pl-6 italic">
            {blog.excerpt}
          </p>
        )}
        
        <div className="prose prose-lg dark:prose-invert prose-p:leading-loose prose-p:text-dim prose-headings:text-foreground max-w-none whitespace-pre-wrap">
          {blog.content}
        </div>
      </div>
    </article>
  );
}
