"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { logout } from "@/app/auth/actions";

export default function Navbar({ user }: { user: any }) {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="navbar" role="banner">
      <div className="navbar__inner">
        <Link href="/" className="navbar__logo">Blog Hut</Link>

        <div className="navbar__actions">
          {user && (
            <button 
              className="write-btn"
              onClick={() => setWriteModalOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              <span>Write</span>
            </button>
          )}

          <button
            className="theme-toggle"
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            id="theme-toggle-btn"
          >
            <span className={`theme-toggle__track ${dark ? "dark" : ""}`}>
              <span className="theme-toggle__thumb" />
            </span>
            <span className="theme-toggle__icon" aria-hidden="true">
              {dark ? "🌙" : "☀️"}
            </span>
          </button>

          <div className="profile-menu" ref={dropdownRef}>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <button
                  className="profile-btn"
                  style={user.user_metadata?.avatar_url ? { padding: 0, overflow: 'hidden', border: 'none' } : {}}
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-label="Toggle profile menu"
                  aria-expanded={profileOpen}
                >
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                </button>
                
                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown__header" style={{ padding: "8px 12px", fontSize: "12px", color: "var(--text-muted)", borderBottom: "1px solid var(--border)", marginBottom: "4px" }}>
                      {user.user_metadata?.full_name || user.email}
                    </div>
                    <Link href="/profile" className="profile-dropdown__link" onClick={() => setProfileOpen(false)}>Profile</Link>
                    <button 
                      className="profile-dropdown__btn" 
                      onClick={() => startTransition(() => logout())}
                      disabled={isPending}
                    >
                      {isPending ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Link href="/login" style={{ fontSize: '14px', fontWeight: 500 }}>Log in</Link>
                <Link href="/signup" className="auth-btn" style={{ padding: '8px 16px', marginTop: 0 }}>Sign up</Link>
              </div>
            )}
          </div>

          <button
            id="mobile-menu-toggle"
            className="navbar__hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`hline ${menuOpen ? "open" : ""}`} />
            <span className={`hline ${menuOpen ? "open" : ""}`} />
            <span className={`hline ${menuOpen ? "open" : ""}`} />
          </button>
        </div>
      </div>

      <div className="navbar__divider" aria-hidden="true" />

      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-content">
          <Link href="/" className="mobile-menu-logo" onClick={() => setMenuOpen(false)}>Blog Hut</Link>

          {user ? (
            <>
              <button className="mobile-menu-link" onClick={() => { setMenuOpen(false); setWriteModalOpen(true); }}>Write a Blog</button>
              <Link href="/profile" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button 
                className="mobile-menu-link" 
                onClick={() => startTransition(() => logout())}
                disabled={isPending}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link href="/signup" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Sign up</Link>
            </>
          )}

          <button
            className="theme-toggle mobile-theme-toggle"
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className={`theme-toggle__track ${dark ? "dark" : ""}`}>
              <span className="theme-toggle__thumb" />
            </span>
            <span className="theme-toggle__icon" aria-hidden="true">
              {dark ? "🌙" : "☀️"}
            </span>
          </button>
        </div>

        <button
          className="mobile-menu-close"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {writeModalOpen && (
        <div className="write-modal-overlay">
          <div className="write-modal">
            <div className="write-modal__header">
              <h2>Create a new story</h2>
              <button className="write-modal__close" onClick={() => setWriteModalOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="write-modal__content">
              <form className="write-modal__form">
                <input type="text" placeholder="Title" className="write-modal__input write-modal__input--title" />
                <textarea placeholder="Tell your story..." className="write-modal__textarea"></textarea>
                <div className="write-modal__actions">
                  <button type="button" className="write-modal__cancel" onClick={() => setWriteModalOpen(false)}>Cancel</button>
                  <button type="submit" className="write-modal__submit">Publish</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
