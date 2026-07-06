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

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Toaster } from "react-hot-toast";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans antialiased transition-colors duration-300">
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            }
          }}
        />
        <Navbar user={user} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
