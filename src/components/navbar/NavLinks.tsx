import Link from "next/link";

const links = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
];

export default function NavLinks() {
  return (
    <ul className="nav-links__list" role="list">
      {links.map(({ label, href }) => (
        <li key={href}>
          <Link href={href} className="nav-links__item">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
