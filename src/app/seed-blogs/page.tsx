"use client";

import { useState } from "react";
import { seedRealisticBlogs } from "./actions";

export default function SeedBlogsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSeed = async () => {
    setLoading(true);
    setMessage("Seeding 20 realistic blogs into the database...");
    
    try {
      const res = await seedRealisticBlogs();
      if (res.error) {
        setMessage(`Error: ${res.error}`);
      } else {
        setMessage("Success! 20 brand new realistic blogs have been added to your database.");
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-card border border-border p-8 rounded-2xl max-w-md w-full shadow-2xl text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Database Seeder</h1>
        <p className="text-muted mb-8">
          This will inject 20 highly realistic, formatted blogs directly into your Supabase database, assigned to your logged-in user account.
        </p>
        
        <button 
          onClick={handleSeed}
          disabled={loading}
          className="w-full bg-foreground text-background font-bold py-3 px-6 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Injecting Data..." : "Seed 20 Realistic Blogs"}
        </button>

        {message && (
          <div className={`mt-6 p-4 rounded-xl text-sm font-medium ${message.includes("Error") ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
