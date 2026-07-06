import Link from "next/link";

export default function NavLogo() {
  return (
    <Link href="/" className="nav-logo" aria-label="Blog Hut home">
      <span className="nav-logo__icon" aria-hidden="true">✦</span>
      <span className="nav-logo__text">
        Blog<span className="nav-logo__accent">Hut</span>
      </span>
    </Link>
  );
}
