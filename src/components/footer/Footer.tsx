export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="posts-container">
        <div className="site-footer__inner">
          <span>© {year}</span>
          <nav className="site-footer__links" aria-label="Footer links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-link">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
            <a href="mailto:hello@bloghut.com" className="footer-link">Email</a>
            <a href="/feed.xml" className="footer-link">RSS feed</a>
            <a href="https://feedly.com" target="_blank" rel="noopener noreferrer" className="footer-link">Add to Feedly</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
