import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlogHut — Where Great Ideas Find Their Home",
  description:
    "Explore thousands of expert articles on technology, design, culture, science, and more. Hand-curated stories for the curious mind.",
  keywords: ["blog", "articles", "technology", "design", "culture", "writing"],
  authors: [{ name: "BlogHut Team" }],
  openGraph: {
    title: "BlogHut — Where Great Ideas Find Their Home",
    description:
      "Explore thousands of expert articles on technology, design, culture, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="site-body">
        <Navbar />
        <main id="main-content" className="site-main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
