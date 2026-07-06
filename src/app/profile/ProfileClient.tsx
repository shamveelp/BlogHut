"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { updateProfile } from "@/app/auth/actions";
import Link from "next/link";
import { deleteBlog } from "@/app/blog/actions";
import WriteBlogModal from "@/components/blog/WriteBlogModal";
import { GridBlogCard } from "@/components/blog/BlogCards";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return Promise.reject(new Error('No 2d context'));

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg');
  });
}

export default function ProfileClient({ user, initialBlogs = [] }: { user: any, initialBlogs?: any[] }) {
  const metadata = user.user_metadata || {};
  const [name, setName] = useState(metadata.full_name || "");
  const [username, setUsername] = useState(metadata.username || "");
  const [avatarUrl, setAvatarUrl] = useState(metadata.avatar_url || "");
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropping State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
        setCropModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const c = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 1, width, height), width, height);
    setCrop(c);
  };

  const handleUploadCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) return;
    
    setCropModalOpen(false);
    setIsUploading(true);
    const toastId = toast.loading("Uploading image...");

    try {
      const blob = await getCroppedImg(imgRef.current, completedCrop);
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET || "ml_default"); // Provide a fallback just in case

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
      if (!cloudName) throw new Error("Cloudinary not configured");

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setAvatarUrl(data.secure_url);
        toast.success("Image uploaded successfully! Remember to save changes.", { id: toastId });
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Saving profile...");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      if (avatarUrl) formData.append("avatar_url", avatarUrl);

      const res = await updateProfile(formData);
      
      if (res.error) throw new Error(res.error);
      
      toast.success("Profile updated successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<"published" | "drafts">("published");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const publishedBlogs = initialBlogs.filter(b => b.status === "published");
  const draftBlogs = initialBlogs.filter(b => b.status === "draft");
  const displayBlogs = activeTab === "published" ? publishedBlogs : draftBlogs;
  const totalPages = Math.ceil(displayBlogs.length / itemsPerPage);
  const paginatedBlogs = displayBlogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openWriteModal = (blog: any = null) => {
    setEditingBlog(blog);
    setWriteModalOpen(true);
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const confirmDeleteBlog = async () => {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    const toastId = toast.loading("Deleting...");
    const res = await deleteBlog(id);
    if (res.error) toast.error(res.error, { id: toastId });
    else toast.success("Blog deleted!", { id: toastId });
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-8 max-w-[1200px] mx-auto flex flex-col gap-16">
      
      {/* Top Section: Settings */}
      <section>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted">Manage your personal information and preferences.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 flex flex-col lg:flex-row gap-12 shadow-sm">
          {/* Avatar Area */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="relative w-32 h-32 rounded-full border-4 border-background shadow-xl bg-muted flex items-center justify-center overflow-hidden group">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <div className="text-4xl font-bold text-muted-foreground">
                  {name ? name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  className="bg-foreground text-background w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isSaving}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                </button>
              </div>
            </div>
            
            <div className="text-center lg:text-left">
              <div className="font-semibold text-foreground text-lg">{name || 'Your Name'}</div>
              <div className="text-sm text-muted bg-[rgba(255,255,255,0.05)] dark:bg-[rgba(0,0,0,0.05)] px-3 py-1 rounded-full inline-block mt-2 border border-border">
                {user.email}
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              onChange={onSelectFile}
            />
          </div>

          {/* Form Area */}
          <form onSubmit={handleSave} className="flex-1 flex flex-col gap-6 lg:border-l border-border lg:pl-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-foreground">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  disabled={isSaving || isUploading}
                  className="bg-transparent border border-border text-foreground px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-muted focus:ring-1 focus:ring-muted transition-all disabled:opacity-50"
                  placeholder="John Doe"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-sm font-semibold text-foreground">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted select-none">@</span>
                  <input 
                    type="text" 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    disabled={isSaving || isUploading}
                    className="w-full bg-transparent border border-border text-foreground pl-8 pr-4 py-3 rounded-lg text-sm focus:outline-none focus:border-muted focus:ring-1 focus:ring-muted transition-all disabled:opacity-50"
                    placeholder="johndoe"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                className="bg-foreground text-background px-8 py-3 rounded-lg font-bold text-sm hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-sm" 
                disabled={isSaving || isUploading}
              >
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Bottom Section: User Blogs */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">Your Blogs</h2>
            <p className="text-muted">Articles and stories you have published or drafted.</p>
          </div>
          <button onClick={() => openWriteModal()} className="hidden sm:flex bg-transparent border border-border text-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-foreground/5 transition-colors">
            Write New Blog
          </button>
        </div>

        <div className="flex items-center gap-4 border-b border-border mb-8">
          <button 
            onClick={() => { setActiveTab("published"); setCurrentPage(1); }}
            className={`pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${activeTab === "published" ? "border-foreground text-foreground" : "border-transparent text-muted hover:text-foreground"}`}
          >
            Published ({publishedBlogs.length})
          </button>
          <button 
            onClick={() => { setActiveTab("drafts"); setCurrentPage(1); }}
            className={`pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${activeTab === "drafts" ? "border-foreground text-foreground" : "border-transparent text-muted hover:text-foreground"}`}
          >
            Drafts ({draftBlogs.length})
          </button>
        </div>

        {displayBlogs.length > 0 ? (
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBlogs.map((blog) => (
                <div key={blog.id} className="relative group flex flex-col h-full">
                  <div className={blog.status === "draft" ? "opacity-75" : ""}>
                    <GridBlogCard 
                      post={{
                        slug: blog.slug,
                        author: user.user_metadata?.full_name || 'You',
                        date: new Date(blog.created_at).toLocaleDateString(),
                        title: blog.title,
                        excerpt: blog.excerpt,
                        tags: blog.tags || [],
                        imgSeed: blog.cover_image || "a"
                      }}
                    />
                  </div>
                  {blog.status === "draft" && (
                    <div className="absolute top-4 left-4 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">
                      Draft
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button onClick={() => openWriteModal(blog)} className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black/80 shadow-md transition-all">Edit</button>
                    <button onClick={() => setDeleteConfirmId(blog.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-700 shadow-md transition-all">Delete</button>
                  </div>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 border-t border-border pt-8">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button 
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${currentPage === pageNum ? 'bg-foreground text-background' : 'text-muted hover:bg-muted/20 hover:text-foreground'}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full bg-card border border-border border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No {activeTab} yet</h3>
            <p className="text-muted max-w-sm mb-6">You haven't {activeTab === "drafts" ? "drafted" : "published"} any articles yet. Start sharing your thoughts and stories with the world!</p>
            <button onClick={() => openWriteModal()} className="bg-foreground text-background px-6 py-3 rounded-lg font-bold text-sm hover:opacity-85 transition-opacity shadow-sm">
              Write a new blog
            </button>
          </div>
        )}
      </section>

      {writeModalOpen && (
        <WriteBlogModal 
          onClose={() => setWriteModalOpen(false)} 
          existingBlog={editingBlog} 
        />
      )}

      {/* Image Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-[500px] shadow-2xl flex flex-col overflow-hidden max-h-[90dvh]">
            <div className="p-5 border-b border-border flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-foreground">Crop Profile Picture</h3>
              <button onClick={() => setCropModalOpen(false)} className="text-muted hover:text-foreground">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-6 flex flex-col items-center justify-center bg-background/50 overflow-y-auto">
              {imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    className="max-h-[50vh] w-auto object-contain"
                  />
                </ReactCrop>
              )}
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3 shrink-0">
              <button onClick={() => setCropModalOpen(false)} className="px-4 py-2 rounded-lg font-semibold text-sm text-foreground hover:bg-foreground/5 transition-colors">Cancel</button>
              <button onClick={handleUploadCroppedImage} className="bg-foreground text-background px-6 py-2 rounded-lg font-bold text-sm hover:opacity-85 transition-opacity">Apply & Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-[400px] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Delete Blog</h3>
              <p className="text-muted text-sm leading-relaxed">
                Are you sure you want to delete this blog? This action cannot be undone and will permanently remove the content.
              </p>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3 bg-muted/5">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 rounded-lg font-semibold text-sm text-foreground hover:bg-foreground/5 transition-colors">Cancel</button>
              <button onClick={confirmDeleteBlog} className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-600 transition-colors shadow-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
