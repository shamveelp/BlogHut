"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="navbar" role="banner">
      <div className="navbar__inner">
        <Link href="/" className="navbar__logo">Blog Hut</Link>

        <nav className="navbar__nav" aria-label="Main navigation">
          <Link href="/blog" className="navbar__link">Blog</Link>
          <Link href="/projects" className="navbar__link">Projects</Link>
          <Link href="/about" className="navbar__link">About</Link>
          <Link href="/newsletter" className="navbar__link">Newsletter</Link>
        </nav>

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

      <div className="navbar__divider" aria-hidden="true" />

      {menuOpen && (
        <nav className="mobile-nav" id="mobile-menu" aria-label="Mobile navigation">
          {["Blog", "Projects", "About", "Newsletter"].map((l) => (
            <Link key={l} href={`/${l.toLowerCase()}`} className="mobile-nav__link" onClick={() => setMenuOpen(false)}>{l}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
