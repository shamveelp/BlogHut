"use client";

import { login } from "@/app/auth/actions";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import toast from "react-hot-toast";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message");

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
  }, [message]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await login(formData);
    if (res?.error) {
      toast.error(res.error);
    } else if (res?.success) {
      toast.success("Logged in successfully!");
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-[calc(100dvh-80px)] flex items-center justify-center p-5">
      <div className="w-full max-w-[400px] bg-card border border-border rounded-xl p-8">
        <h1 className="text-2xl font-bold text-foreground mb-1 text-center">Welcome back</h1>
        <p className="text-sm text-muted text-center mb-6">Log in to your account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <input type="email" id="email" name="email" required placeholder="you@example.com" className="w-full bg-transparent border border-border text-foreground px-3.5 py-2.5 rounded-md font-sans text-sm focus:outline-none focus:border-muted transition-colors" />
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
                className="w-full bg-transparent border border-border text-foreground px-3.5 py-2.5 pr-10 rounded-md font-sans text-sm focus:outline-none focus:border-muted transition-colors"
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

          <button type="submit" className="bg-foreground text-background py-3 rounded-md font-semibold text-[15px] mt-3 hover:opacity-85 transition-opacity disabled:opacity-50">Log in</button>
        </form>

        <p className="mt-6 text-sm text-center text-muted">
          Don't have an account? <Link href="/signup" className="text-foreground font-medium underline underline-offset-4 hover:opacity-80">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-page">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
