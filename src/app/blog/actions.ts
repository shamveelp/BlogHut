"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

  // Generate slug
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  // Ensure uniqueness in a real app by appending ID or checking db, but this is fine for now
  slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;

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

  const updateData: any = {
    title,
    excerpt,
    content,
    category,
    tags,
    status,
    updated_at: new Date().toISOString(),
  };

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
