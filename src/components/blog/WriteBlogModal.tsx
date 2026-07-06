"use client";

import { useState, useRef, useTransition } from "react";
import { createPortal } from "react-dom";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import toast from "react-hot-toast";
import { createBlog, updateBlog } from "@/app/blog/actions";
import { useRouter } from "next/navigation";

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
      if (!blob) reject(new Error('Canvas is empty'));
      else resolve(blob);
    }, 'image/jpeg');
  });
}

export default function WriteBlogModal({ 
  onClose, 
  existingBlog = null 
}: { 
  onClose: () => void,
  existingBlog?: any 
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(existingBlog?.title || "");
  const [excerpt, setExcerpt] = useState(existingBlog?.excerpt || "");
  const [content, setContent] = useState(existingBlog?.content || "");
  const [category, setCategory] = useState(existingBlog?.category || "");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(existingBlog?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [coverUrl, setCoverUrl] = useState(existingBlog?.cover_image || "");

  // Crop State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be less than 10MB");
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
    const c = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 16/9, width, height), width, height);
    setCrop(c);
  };

  const handleUploadCover = async () => {
    if (!completedCrop || !imgRef.current) return;
    
    setCropModalOpen(false);
    setIsUploading(true);
    const toastId = toast.loading("Uploading cover...");

    try {
      const blob = await getCroppedImg(imgRef.current, completedCrop);
      const file = new File([blob], "cover.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET || "ml_default");

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setCoverUrl(data.secure_url);
        toast.success("Cover uploaded!", { id: toastId });
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

  const handleSubmit = (e: React.FormEvent, status: "draft" | "published") => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Title and Content are required!");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      if (existingBlog) formData.append("id", existingBlog.id);
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("tags", tags.join(","));
      formData.append("cover_image", coverUrl);
      formData.append("status", status);

      let res;
      if (existingBlog) {
        res = await updateBlog(formData);
      } else {
        res = await createBlog(formData);
      }

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(existingBlog ? "Blog updated!" : "Blog published!");
        onClose();
        router.refresh();
      }
    });
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-xl w-full max-w-[800px] shadow-2xl flex flex-col max-h-[90dvh]">
          <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
            <h2 className="text-xl font-bold text-foreground">{existingBlog ? "Edit Story" : "Create a new story"}</h2>
            <button className="text-muted hover:text-foreground transition-colors" onClick={onClose} disabled={isPending || isUploading}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
            <form className="flex flex-col gap-5">
              
              {/* Cover Image */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">Cover Image</label>
                {coverUrl ? (
                  <div className="relative w-full h-[200px] rounded-lg overflow-hidden border border-border group">
                    <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-foreground text-background px-4 py-2 rounded-lg font-semibold text-sm hover:scale-105 transition-transform">Change</button>
                      <button type="button" onClick={() => setCoverUrl("")} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:scale-105 transition-transform">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-full h-[150px] rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-muted transition-colors bg-background/50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted mb-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    <span className="text-sm font-medium text-muted">Click to upload cover image (16:9 recommended)</span>
                  </div>
                )}
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={onSelectFile} />
              </div>

              <div className="flex flex-col gap-2">
                <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="bg-transparent border border-border rounded-lg p-4 font-sans text-2xl font-bold text-foreground focus:outline-none focus:border-muted focus:ring-1 focus:ring-muted transition-colors placeholder:font-normal" />
              </div>

              <div className="flex flex-col gap-2">
                <textarea placeholder="Write a short excerpt..." value={excerpt} onChange={e => setExcerpt(e.target.value)} className="bg-transparent border border-border rounded-lg p-3 font-sans text-sm text-foreground resize-y focus:outline-none focus:border-muted transition-colors min-h-[80px]"></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2 relative">
                  <label className="text-sm font-semibold text-foreground">Category</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setCategoryOpen(!categoryOpen)}
                      className="w-full bg-transparent border border-border rounded-lg p-3 font-sans text-sm text-foreground focus:outline-none focus:border-muted transition-colors flex items-center justify-between min-h-[46px]"
                    >
                      <span className={category ? "text-foreground" : "text-muted"}>
                        {category || "Select a category"}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-muted transition-transform ${categoryOpen ? 'rotate-180' : ''}`}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>

                    {categoryOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setCategoryOpen(false)} />
                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-card border border-border rounded-lg shadow-xl z-20 max-h-[200px] overflow-y-auto py-1">
                          {["Design", "Tech", "Leadership", "Product", "SaaS", "Frameworks", "Presentation", "Interface", "Management", "Podcasts", "Customer Success", "Software Development"].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted/20 transition-colors ${category === cat ? 'bg-muted/10 font-semibold text-foreground' : 'text-muted-foreground'}`}
                              onClick={() => {
                                setCategory(cat);
                                setCategoryOpen(false);
                              }}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground flex justify-between">
                    <span>Tags</span>
                    <span className="text-muted text-xs font-normal">{tags.length} / 3</span>
                  </label>
                  <div className="bg-transparent border border-border rounded-lg p-2 flex flex-wrap gap-2 items-center focus-within:border-muted transition-colors min-h-[46px]">
                    {tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 bg-muted/20 text-foreground px-2 py-1 rounded-md text-xs font-semibold border border-border">
                        {tag}
                        <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} className="text-muted hover:text-red-500">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      placeholder={tags.length < 3 ? "Type & press Enter..." : "Max 3 tags"}
                      value={tagInput} 
                      onChange={e => setTagInput(e.target.value)}
                      disabled={tags.length >= 3}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = tagInput.trim();
                          if (val && tags.length < 3 && !tags.includes(val)) {
                            setTags([...tags, val]);
                            setTagInput("");
                          }
                        }
                      }}
                      className="flex-1 bg-transparent border-none text-sm text-foreground focus:outline-none min-w-[100px] disabled:opacity-50" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <textarea placeholder="Write your full story here..." value={content} onChange={e => setContent(e.target.value)} className="bg-transparent border border-border rounded-lg p-4 font-sans text-base text-foreground min-h-[300px] resize-y focus:outline-none focus:border-muted transition-colors flex-1"></textarea>
              </div>
            </form>
          </div>

          <div className="flex justify-end gap-3 p-5 border-t border-border shrink-0 bg-card">
            <button type="button" onClick={onClose} disabled={isPending || isUploading} className="px-5 py-2.5 rounded-lg font-semibold text-sm text-foreground bg-transparent border border-border hover:bg-foreground/5 transition-colors">Cancel</button>
            <button type="button" onClick={(e) => handleSubmit(e, "draft")} disabled={isPending || isUploading} className="px-5 py-2.5 rounded-lg font-semibold text-sm text-foreground bg-background border border-border hover:opacity-85 transition-opacity">Save as Draft</button>
            <button type="button" onClick={(e) => handleSubmit(e, "published")} disabled={isPending || isUploading} className="px-5 py-2.5 rounded-lg font-semibold text-sm bg-foreground text-background hover:opacity-85 transition-opacity">
              {isPending ? "Publishing..." : "Publish Blog"}
            </button>
          </div>
        </div>
      </div>

      {cropModalOpen && (
        <div className="fixed inset-0 z-[2001] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-[600px] shadow-2xl flex flex-col overflow-hidden max-h-[90dvh]">
            <div className="p-5 border-b border-border flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-foreground">Crop Cover Image</h3>
              <button onClick={() => setCropModalOpen(false)} className="text-muted hover:text-foreground">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-6 flex flex-col items-center justify-center bg-background/50 overflow-y-auto">
              {imgSrc && (
                <ReactCrop crop={crop} onChange={(_, p) => setCrop(p)} onComplete={(c) => setCompletedCrop(c)} aspect={16/9}>
                  <img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={onImageLoad} className="max-h-[50vh] w-auto object-contain" />
                </ReactCrop>
              )}
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3 shrink-0">
              <button onClick={() => setCropModalOpen(false)} className="px-4 py-2 rounded-lg font-semibold text-sm text-foreground hover:bg-foreground/5 transition-colors">Cancel</button>
              <button onClick={handleUploadCover} className="bg-foreground text-background px-6 py-2 rounded-lg font-bold text-sm hover:opacity-85 transition-opacity">Apply & Upload</button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
