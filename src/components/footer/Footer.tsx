export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-border pt-16 pb-8 bg-background">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div className="max-w-xs">
            <h2 className="text-xl font-bold text-foreground mb-4">Blog Hut</h2>
            <p className="text-sm text-dim leading-relaxed">
              Explore thousands of expert articles on technology, design, culture, and more. Hand-curated stories for the curious mind.
            </p>
          </div>
          
          <div className="flex gap-16 flex-wrap">
            <nav className="flex flex-col gap-3" aria-label="Footer links">
              <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Social</span>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm text-dim hover:text-primary transition-colors">Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-dim hover:text-primary transition-colors">LinkedIn</a>
            </nav>
            <nav className="flex flex-col gap-3" aria-label="Footer links">
              <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Connect</span>
              <a href="mailto:hello@bloghut.com" className="text-sm text-dim hover:text-primary transition-colors">Email</a>
              <a href="/feed.xml" className="text-sm text-dim hover:text-primary transition-colors">RSS feed</a>
              <a href="https://feedly.com" target="_blank" rel="noopener noreferrer" className="text-sm text-dim hover:text-primary transition-colors">Add to Feedly</a>
            </nav>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex justify-between items-center">
          <span className="text-xs text-dim">© {year} Blog Hut. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
