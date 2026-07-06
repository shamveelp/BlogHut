"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { searchBlogs } from "@/app/blog/actions";
import { PostImage } from "@/components/blog/BlogCards";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchBlogs(query);
      setResults(res);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openMobileSearch = () => {
    setIsOpen(true);
    setTimeout(() => {
      mobileInputRef.current?.focus();
    }, 100);
  };

  const SearchResults = () => (
    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-[1000] max-h-[400px] overflow-y-auto">
      {isSearching && (
        <div className="p-4 text-center text-sm text-muted">Searching...</div>
      )}
      {!isSearching && query && results.length === 0 && (
        <div className="p-4 text-center text-sm text-muted">No articles found.</div>
      )}
      {!isSearching && results.map((blog) => (
        <Link 
          key={blog.id} 
          href={`/blog/${blog.slug}`} 
          onClick={() => { setIsOpen(false); setQuery(""); }}
          className="flex items-center gap-4 p-3 hover:bg-muted/10 border-b border-border last:border-b-0 transition-colors"
        >
          <div className="w-12 h-12 shrink-0 rounded-md overflow-hidden relative bg-muted">
            <PostImage seed={blog.cover_image || "a"} alt={blog.title} />
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="text-sm font-bold text-foreground truncate">{blog.title}</h4>
            <span className="text-xs text-muted truncate">{blog.category || "Article"}</span>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="relative flex items-center" ref={containerRef}>
      {/* Desktop Search Bar */}
      <div className="hidden md:flex relative group">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-foreground transition-colors"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input 
          type="text" 
          placeholder="Search articles..." 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          className="w-[250px] lg:w-[350px] bg-card border border-border rounded-full pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-muted transition-all placeholder:text-muted shadow-sm"
        />
        {isOpen && query.trim() && (
          <div className="absolute top-full right-0 w-[350px]">
            <SearchResults />
          </div>
        )}
      </div>

      {/* Mobile Search Button */}
      <button 
        onClick={openMobileSearch}
        className="md:hidden w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted/10 rounded-full transition-colors mr-2"
        aria-label="Search"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </button>

      {/* Mobile Search Dialog */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[2000] bg-background/95 backdrop-blur-md flex flex-col p-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-3 mb-6 relative">
            <div className="relative flex-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                ref={mobileInputRef}
                type="text" 
                placeholder="Search anything..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-card border border-border rounded-full pl-12 pr-4 py-3 text-sm text-foreground focus:outline-none shadow-sm"
              />
            </div>
            <button 
              onClick={() => { setIsOpen(false); setQuery(""); }}
              className="text-sm font-semibold text-muted hover:text-foreground shrink-0 px-2"
            >
              Cancel
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {query.trim() ? (
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                {isSearching && (
                  <div className="p-6 text-center text-sm text-muted">Searching...</div>
                )}
                {!isSearching && results.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted">No results found for "{query}"</div>
                )}
                {!isSearching && results.map((blog) => (
                  <Link 
                    key={blog.id} 
                    href={`/blog/${blog.slug}`} 
                    onClick={() => { setIsOpen(false); setQuery(""); }}
                    className="flex items-center gap-4 p-4 hover:bg-muted/10 border-b border-border last:border-b-0 transition-colors"
                  >
                    <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden relative bg-muted">
                      <PostImage seed={blog.cover_image || "a"} alt={blog.title} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">{blog.title}</h4>
                      <span className="text-xs text-muted truncate mt-1">{blog.category || "Article"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted/30 mb-4"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <p className="text-sm font-medium text-muted">Type to start searching</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
