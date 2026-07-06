"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { updateProfile } from "@/app/auth/actions";
import Image from "next/image";

export default function ProfileClient({ user }: { user: any }) {
  const metadata = user.user_metadata || {};
  const [name, setName] = useState(metadata.full_name || "");
  const [username, setUsername] = useState(metadata.username || "");
  const [avatarUrl, setAvatarUrl] = useState(metadata.avatar_url || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading image...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET!);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setAvatarUrl(data.secure_url);
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
      
      toast.success("Profile updated!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-80px)] flex items-center justify-center p-5 md:p-10">
      <div className="w-full max-w-[500px] bg-card border border-border rounded-xl p-8 md:p-10">
        <h1 className="text-2xl font-bold text-foreground mb-1 text-center">Your Profile</h1>
        <p className="text-sm text-muted text-center mb-8">Manage your account settings</p>

        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative w-24 h-24 rounded-full border-2 border-border bg-background flex items-center justify-center shadow-sm">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="text-3xl font-bold text-muted">
                {name ? name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <button 
              className="absolute bottom-0 right-0 bg-foreground text-background w-8 h-8 rounded-full flex items-center justify-center border-2 border-card cursor-pointer transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isSaving}
              aria-label="Change profile picture"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              onChange={handleImageChange}
            />
          </div>
          <div className="bg-[rgba(255,255,255,0.05)] dark:bg-[rgba(0,0,0,0.05)] text-muted px-3 py-1 rounded-full text-[13px] font-medium border border-border">
            {user.email}
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              disabled={isSaving || isUploading}
              className="w-full bg-transparent border border-border text-foreground px-3.5 py-2.5 rounded-md font-sans text-sm focus:outline-none focus:border-muted transition-colors disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-medium text-foreground">Username</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              disabled={isSaving || isUploading}
              className="w-full bg-transparent border border-border text-foreground px-3.5 py-2.5 rounded-md font-sans text-sm focus:outline-none focus:border-muted transition-colors disabled:opacity-50"
            />
          </div>

          <button 
            type="submit" 
            className="bg-foreground text-background py-3 rounded-md font-semibold text-[15px] mt-3 hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={isSaving || isUploading}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
