// app/(main)/discover/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/authStore";
import * as api from "@/lib/api";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Skeleton Loader
function BriefingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="h-96 animate-pulse bg-muted" />
      ))}
    </div>
  );
}

export default function DiscoverPage() {
  const [page, setPage] = useState(1);
  const { user } = useAuthStore();
  
  // "Discover" will be our "Technology" category feed
  const DISCOVER_CATEGORY = "Technology";

  const { data, isLoading, error, isPlaceholderData } = useQuery({ // <-- RENAMED
    queryKey: ["discoverNews", DISCOVER_CATEGORY, page],
    queryFn: () => api.fetchNews(user!.email!, DISCOVER_CATEGORY, page),
    enabled: !!user,
    placeholderData: (previousData) => previousData, // <-- NEW SYNTAX
  });

  if (isLoading || !user) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Discover News</h1>
        <p className="text-muted-foreground">
          Exploring the latest in {DISCOVER_CATEGORY}...
        </p>
        <BriefingSkeleton />
      </div>
    );
  }

  if (error) {
    return <p className="text-rose-500">Error: {(error as Error).message}</p>;
  }

  if (!data || data.articles.length === 0) {
    return <p>No articles found for this category.</p>;
  }

  const totalPages = Math.ceil(data.totalResults / 20); // 20 is pageSize from backend

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Discover: {DISCOVER_CATEGORY}</h1>
      <p className="text-muted-foreground">
        Page {page} of {totalPages} ({data.totalResults} results)
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.articles.map((article) => (
          <ArticleCard key={article.url} article={article} />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>Page {page}</span>
        <Button
          onClick={() => setPage((old) => old + 1)}
          disabled={isPlaceholderData || page === totalPages} // <-- RENAMED
        >
          Next
        </Button>
      </div>
    </div>
  );
}