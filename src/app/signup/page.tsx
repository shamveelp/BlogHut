"use client";

import { signup } from "@/app/auth/actions";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await signup(formData);
    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
    } else if (res?.success) {
      toast.success("Account created successfully!");
      router.push("/login?message=Account created successfully! You can now log in.");
    }
  }

  return (
    <div className="min-h-[calc(100dvh-80px)] flex items-center justify-center p-5">
      <div className="w-full max-w-[400px] bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/5 relative overflow-hidden">
        {/* Subtle decorative gradient */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-foreground/20 to-transparent"></div>
        <h1 className="text-2xl font-bold text-foreground mb-1 text-center">Create an account</h1>
        <p className="text-sm text-muted text-center mb-6">Join Blog Hut today</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
            <input type="text" id="name" name="name" required placeholder="John Doe" className="w-full bg-transparent border border-border text-foreground px-4 py-3 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground transition-all" />
          </div>



          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-border text-foreground px-4 py-3 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
            <div className="relative flex items-center">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                name="password" 
                required 
                placeholder="••••••••" 
                minLength={6} 
                className="w-full bg-transparent border border-border text-foreground px-4 py-3 pr-10 rounded-xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground transition-all"
              />
              <button
                type="button"
                className="absolute right-2.5 bg-transparent border-none text-muted cursor-pointer flex items-center justify-center hover:text-foreground transition-colors"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-foreground text-background py-3.5 rounded-xl font-semibold text-[15px] mt-4 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-foreground/10 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-muted">
          Already have an account? <Link href="/login" className="text-foreground font-medium underline underline-offset-4 hover:opacity-80">Log in</Link>
        </p>
      </div>
    </div>
  );
}
