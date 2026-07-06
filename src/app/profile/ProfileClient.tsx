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
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">Your Profile</h1>
        <p className="profile-subtitle">Manage your account settings</p>

        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile Avatar" className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-placeholder">
                {name ? name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
            )}
            <button 
              className="profile-avatar-edit-btn" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isSaving}
              aria-label="Change profile picture"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              onChange={handleImageChange}
            />
          </div>
          <div className="profile-email-badge">{user.email}</div>
        </div>

        <form onSubmit={handleSave} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              disabled={isSaving || isUploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              disabled={isSaving || isUploading}
            />
          </div>

          <button 
            type="submit" 
            className="profile-save-btn" 
            disabled={isSaving || isUploading}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
