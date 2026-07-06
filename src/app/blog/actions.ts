"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function searchBlogs(query: string) {
  if (!query || query.trim() === "") return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("blogs")
    .select("id, title, slug, cover_image, excerpt, category")
    .eq("status", "published")
    .ilike("title", `%${query}%`)
    .limit(5);
  return data || [];
}

export async function checkSlugAvailable(slug: string, currentBlogId?: string) {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("blogs").select("id").eq("slug", slug);
  if (currentBlogId) {
    query = query.neq("id", currentBlogId);
  }
  const { data } = await query.single();
  return { available: !data };
}

export async function createBlog(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a blog." };
  }

  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const cover_image = formData.get("cover_image") as string;
  const category = formData.get("category") as string;
  const tagsStr = formData.get("tags") as string;
  const status = (formData.get("status") as string) || "published";

  if (!title || !content) {
    return { error: "Title and content are required." };
  }

  let slug = (formData.get("slug") as string)?.trim();
  
  if (!slug) {
    slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
  }

  if (slug.length < 5 || slug.length > 60) {
    return { error: "Slug must be between 5 and 60 characters long." };
  }

  const tags = tagsStr ? tagsStr.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const { data, error } = await supabase.from("blogs").insert({
    title,
    slug,
    excerpt,
    content,
    cover_image,
    category,
    tags,
    status,
    author_id: user.id,
    views: 0,
    published_at: status === "published" ? new Date().toISOString() : null,
  }).select().single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  return { success: true, blog: data };
}

export async function updateBlog(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const cover_image = formData.get("cover_image") as string;
  const category = formData.get("category") as string;
  const tagsStr = formData.get("tags") as string;
  const status = formData.get("status") as string;

  const tags = tagsStr ? tagsStr.split(",").map((t) => t.trim()).filter(Boolean) : [];

  let slug = (formData.get("slug") as string)?.trim();
  if (slug && (slug.length < 5 || slug.length > 60)) {
    return { error: "Slug must be between 5 and 60 characters long." };
  }

  const updateData: any = {
    title,
    excerpt,
    content,
    category,
    tags,
    status,
    updated_at: new Date().toISOString(),
  };

  if (slug) {
    updateData.slug = slug;
  }

  if (cover_image) updateData.cover_image = cover_image;

  const { error } = await supabase.from("blogs").update(updateData).eq("id", id).eq("author_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function deleteBlog(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("blogs").delete().eq("id", id).eq("author_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  return { success: true };
}
