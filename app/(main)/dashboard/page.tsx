// app/(main)/dashboard/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/authStore";
import * as api from "@/lib/api";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// Removed ArticleSentiment import as it's no longer used here

// Skeleton Loader - Now shows 3 cards for full width
function BriefingSkeleton() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Your Daily Briefing</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
           <Card key={i} className="h-[450px] animate-pulse bg-muted" /> // Adjusted height
        ))}
      </div>
    </div>
  );
}

// Removed SentimentSnapshot component

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardNews", user?.email],
    queryFn: () => api.fetchNews(user!.email!, null, 1), // Fetch page 1 by default
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading || !user) {
    return <BriefingSkeleton />; // Show skeleton while loading user or data
  }

  if (error) {
     return (
       <div className="space-y-2">
         <h2 className="text-2xl font-bold">Your Daily Briefing</h2>
         <p className="text-rose-500">Error fetching your briefing: {(error as Error).message}</p>
       </div>
     );
  }

  // Handle case where user has no preferences set yet
  if (user.preferred_domains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground p-12 text-center">
        <h2 className="text-2xl font-bold">Welcome to your Dashboard!</h2>
        <p className="mt-2 text-muted-foreground">
          You haven't selected any interests yet.
        </p>
        <Button asChild className="mt-6">
          <Link href="/settings">Go to Settings to add preferences</Link>
        </Button>
      </div>
    );
  }

  // Handle case where preferences are set but no articles found
  if (!data || data.articles.length === 0) {
     return (
       <div className="space-y-2">
         <h2 className="text-2xl font-bold">Your Daily Briefing</h2>
         <p>No articles found matching your preferences right now.</p>
       </div>
     );
  }

  // Render the main dashboard content
  return (
    // REMOVED outer grid, content now takes full width
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Your Daily Briefing</h2>
      {/* ADJUSTED Grid to be 3 columns on large screens */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.articles.map((article) => (
          <ArticleCard key={article.url} article={article} />
        ))}
      </div>
      {/* You could add pagination here if needed */}
    </div>
  );
}