"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackendArticle } from "@/types";
import { AlertCircle } from "lucide-react";

function BriefingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="h-[500px] animate-shimmer" />
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
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Discover: Top Headlines</h1>
          <p className="text-muted-foreground">
            Fetching the latest top headlines...
          </p>
        </div>
        <BriefingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Discover: Top Headlines</h1>
        <Card className="p-8 border-destructive/50">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="space-y-2">
              <p className="text-destructive font-medium">
                Error fetching headlines
              </p>
              <p className="text-sm text-muted-foreground">
                {(error as Error).message}
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!data || data.articles.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Discover: Top Headlines</h1>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No top headlines found at the moment. Please try again later.
          </p>
        </Card>
      </div>
    );
  }

  const totalPages = Math.ceil(data.totalResults / 20);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Discover: Top Headlines</h1>
        <p className="text-muted-foreground">
          Page {page} of {totalPages > 0 ? totalPages : 1} ({data.totalResults} results)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.articles.map((article: BackendArticle) => (
          <ArticleCard key={article.url} article={article} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => {
              if (!isPlaceholderData && page < totalPages) {
                setPage((old) => old + 1);
              }
            }}
            disabled={isPlaceholderData || page >= totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}