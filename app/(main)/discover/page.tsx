// app/(main)/discover/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackendArticle } from "@/types";

function BriefingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="h-[450px] animate-pulse bg-muted" /> // Adjusted height
      ))}
    </div>
  );
}

export default function DiscoverPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: ["topHeadlines", page],
    queryFn: () => api.fetchTopHeadlines(page),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Discover: Top Headlines</h1>
        <p className="text-muted-foreground">
          Fetching the latest top headlines...
        </p>
        <BriefingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Discover: Top Headlines</h1>
        <p className="text-rose-500">Error fetching headlines: {(error as Error).message}</p>
      </div>
    );
  }

  if (!data || data.articles.length === 0) {
    return (
       <div className="space-y-8">
         <h1 className="text-3xl font-bold">Discover: Top Headlines</h1>
         <p>No top headlines found at the moment.</p>
       </div>
    );
  }

  const totalPages = Math.ceil(data.totalResults / 20);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Discover: Top Headlines</h1>
      <p className="text-muted-foreground">
        Page {page} of {totalPages > 0 ? totalPages : 1} ({data.totalResults} results)
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.articles.map((article: BackendArticle) => (
          <ArticleCard key={article.url} article={article} />
        ))}
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>Page {page}</span>
        <Button
          onClick={() => {
            if (!isPlaceholderData && page < totalPages) {
              setPage((old) => old + 1);
            }
          }}
          disabled={isPlaceholderData || page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}