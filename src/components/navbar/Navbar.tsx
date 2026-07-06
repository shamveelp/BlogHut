"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Navbar() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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
            <button
              className="profile-btn"
              onClick={() => setProfileOpen((v) => !v)}
              aria-label="Toggle profile menu"
              aria-expanded={profileOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            
            {profileOpen && (
              <div className="profile-dropdown">
                <Link href="/profile" className="profile-dropdown__link" onClick={() => setProfileOpen(false)}>Profile</Link>
                <button className="profile-dropdown__btn" onClick={() => setProfileOpen(false)}>Logout</button>
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

          <Link href="/profile" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Profile</Link>
          <button className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Logout</button>

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
    </header>
  );
}
