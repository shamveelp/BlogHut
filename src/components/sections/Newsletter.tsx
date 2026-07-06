"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // Simulated async — replace with Supabase insert
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="newsletter" aria-label="Newsletter signup">
      <div className="newsletter__inner">
        <div className="newsletter__glow" aria-hidden="true" />
        <div className="newsletter__content">
          <div className="section-eyebrow" style={{ color: "var(--accent-violet)" }}>Stay in the loop</div>
          <h2 className="newsletter__title">Get the Best Stories, Delivered Weekly</h2>
          <p className="newsletter__subtitle">
            Join 50,000+ readers who get our hand-curated digest every Sunday morning. No spam, ever.
          </p>

          {status === "success" ? (
            <div className="newsletter__success" role="status" aria-live="polite">
              <span className="newsletter__success-icon">✓</span>
              You&apos;re in! Check your inbox to confirm your subscription.
            </div>
          ) : (
            <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                className="newsletter__input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-required="true"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                className={`newsletter__submit ${status === "loading" ? "loading" : ""}`}
                disabled={status === "loading"}
                aria-label="Subscribe to newsletter"
              >
                {status === "loading" ? (
                  <span className="spinner" aria-hidden="true" />
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          )}

          <p className="newsletter__note">
            By subscribing you agree to our{" "}
            <a href="/privacy" className="newsletter__link">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
