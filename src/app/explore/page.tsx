import { Suspense } from "react";
import ExploreClient from "./ExploreClient";

export default function ExplorePage() {
  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <Suspense fallback={<div className="py-20 text-center text-muted animate-pulse">Loading articles...</div>}>
          <ExploreClient />
        </Suspense>
      </div>
    </div>
  );
}
