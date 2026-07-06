"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import WriteBlogModal from "@/components/blog/WriteBlogModal";
import GlobalSearch from "./GlobalSearch";

export default function Navbar({ user }: { user: any }) {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-[100] w-full bg-background/80 backdrop-blur-lg border-b border-border transition-colors duration-300" role="banner">
      <div className="max-w-[1200px] mx-auto px-8 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity z-[1001]">Blog Hut</Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <GlobalSearch />
          
          <button
            className="hidden sm:flex relative items-center w-16 h-8 rounded-full bg-foreground transition-colors hover:opacity-90 shadow-sm"
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle theme"
            id="theme-toggle-btn"
          >
            <span className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-background transition-transform duration-300 z-10 ${dark ? "translate-x-0" : "translate-x-8"}`} />
            <div className="w-full flex justify-between items-center px-2.5 text-background relative z-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={dark ? "opacity-0" : "opacity-100"}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={dark ? "opacity-100" : "opacity-0"}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </div>
          </button>

          <div className="relative hidden sm:block" ref={dropdownRef}>
            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  className="flex items-center gap-1.5 bg-foreground text-background px-4 py-2 rounded-full text-sm font-semibold hover:opacity-85 transition-opacity shadow-sm"
                  onClick={() => setWriteModalOpen(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  <span>Write</span>
                </button>
                <button
                  className="w-10 h-10 rounded-full border-2 border-border overflow-hidden bg-background flex items-center justify-center hover:border-muted transition-colors focus:outline-none focus:ring-2 focus:ring-foreground"
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-label="Toggle profile menu"
                  aria-expanded={profileOpen}
                >
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                </button>
                
                {profileOpen && (
                  <div className="absolute top-[calc(100%+12px)] right-0 w-56 bg-card border border-border rounded-xl shadow-2xl py-2 flex flex-col z-50 transform origin-top-right transition-all">
                    <div className="px-4 py-3 text-sm text-muted border-b border-border/50 mb-1 flex flex-col">
                       <span className="font-semibold text-foreground truncate">{user.user_metadata?.full_name || 'User'}</span>
                       <span className="text-xs truncate">{user.email}</span>
                    </div>
                    <Link href="/profile" className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors flex items-center gap-2" onClick={() => setProfileOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      Profile Settings
                    </Link>
                    <button 
                      className="px-4 py-2.5 text-sm font-medium text-left text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 flex items-center gap-2" 
                      onClick={() => startTransition(() => logout())}
                      disabled={isPending}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      {isPending ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-semibold hover:opacity-80 transition-opacity">Log in</Link>
                <Link href="/signup" className="bg-foreground text-background px-4 py-2 rounded-full font-semibold text-sm hover:opacity-85 transition-opacity shadow-sm">Sign up</Link>
              </div>
            )}
          </div>

          <button
            id="mobile-menu-toggle"
            className="block sm:hidden relative w-6 h-[18px] focus:outline-none z-[1001] flex flex-col justify-between"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`block w-full h-[2px] bg-foreground rounded-full transition-all duration-300 ease-in-out origin-center ${menuOpen ? "rotate-45 translate-y-[8px]" : ""}`} />
            <span className={`block w-full h-[2px] bg-foreground rounded-full transition-all duration-300 ease-in-out ${menuOpen ? "opacity-0 translate-x-2" : "opacity-100"}`} />
            <span className={`block w-full h-[2px] bg-foreground rounded-full transition-all duration-300 ease-in-out origin-center ${menuOpen ? "-rotate-45 -translate-y-[8px]" : ""}`} />
          </button>
        </div>
      </div>

      <div className="navbar__divider" aria-hidden="true" />

      {mounted && createPortal(
        <>
          <div className={`fixed inset-0 z-[999] bg-background flex flex-col items-center justify-center overflow-y-auto transition-all duration-300 ${menuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`} aria-hidden={!menuOpen}>
            <div className={`flex flex-col items-center gap-8 py-12 w-full max-w-xs transition-transform duration-500 delay-100 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="text-xl font-bold text-foreground mb-4">Blog Hut</div>

              {user ? (
                <>
                  <button className="text-[17px] font-normal text-foreground/90 hover:text-foreground transition-colors" onClick={() => { setMenuOpen(false); setWriteModalOpen(true); }}>Write a Blog</button>
                  <Link href="/profile" className="text-[17px] font-normal text-foreground/90 hover:text-foreground transition-colors" onClick={() => setMenuOpen(false)}>Profile Settings</Link>
                  <button 
                    className="text-[17px] font-normal text-foreground/90 hover:text-foreground transition-colors disabled:opacity-50" 
                    onClick={() => startTransition(() => logout())}
                    disabled={isPending}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-[17px] font-normal text-foreground/90 hover:text-foreground transition-colors" onClick={() => setMenuOpen(false)}>Log in</Link>
                  <Link href="/signup" className="text-[17px] font-normal text-foreground/90 hover:text-foreground transition-colors" onClick={() => setMenuOpen(false)}>Sign up</Link>
                </>
              )}

              <button
                className="mt-6 relative flex items-center w-20 h-10 rounded-full bg-foreground transition-colors"
                onClick={() => setDark((d) => !d)}
                aria-label="Toggle theme"
              >
                <span className={`absolute left-1 top-1 w-8 h-8 rounded-full bg-background transition-transform duration-300 z-10 ${dark ? "translate-x-0" : "translate-x-10"}`} />
                <div className="w-full flex justify-between items-center px-3 text-background relative z-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={dark ? "opacity-0" : "opacity-100"}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={dark ? "opacity-100" : "opacity-0"}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                </div>
              </button>

              <button
                className="mt-8 text-foreground p-4 hover:opacity-70 transition-opacity"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {writeModalOpen && (
            <WriteBlogModal onClose={() => setWriteModalOpen(false)} />
          )}
        </>,
        document.body
      )}
    </header>
  );
}
