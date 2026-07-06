"use client";

import Link from "next/link";

const links = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <div
      id="mobile-menu"
      className={`mobile-menu ${isOpen ? "mobile-menu--open" : ""}`}
      aria-hidden={!isOpen}
    >
      <nav aria-label="Mobile navigation">
        <ul className="mobile-menu__list" role="list">
          {links.map(({ label, href }) => (
            <li key={href} className="mobile-menu__item">
              <Link href={href} className="mobile-menu__link" onClick={onClose}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mobile-menu__footer">
        <Link href="/blog" className="nav-actions__cta w-full text-center" onClick={onClose}>
          Start Reading
        </Link>
      </div>
    </div>
  );
}
