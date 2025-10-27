"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/authStore";
import * as api from "@/lib/api";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Glasses, Settings, ChevronLeft, ChevronRight } from "lucide-react";

function BriefingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-9 w-64 animate-shimmer rounded-lg" />
        <div className="h-6 w-48 animate-shimmer rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-[500px] animate-shimmer" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);

  const { data, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: ["dashboardNews", user?.email, page],
    queryFn: () => api.fetchNews(user!.email!, null, page),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  if (isLoading || !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <BriefingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="space-y-4 max-w-lg text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Your Daily Briefing
          </h2>
          <Card className="p-8 border-destructive/50">
            <p className="text-destructive">
              Error fetching your briefing: {(error as Error).message}
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (user.preferred_domains.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-12 md:p-16 text-center max-w-2xl w-full">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
            <Glasses className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome to NewsLens!
          </h2>
          <p className="text-muted-foreground max-w-sm mb-8 text-base md:text-lg">
            Let's personalize your news feed. Select topics you're interested in
            to get started.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/settings">
              <Settings className="h-4 w-4" />
              Choose Your Interests
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!data || data.articles.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="space-y-4 max-w-lg text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Your Daily Briefing
          </h2>
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No articles found matching your preferences right now. Try
              adjusting your interests in settings.
            </p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Update Preferences
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(data.totalResults / 20);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="space-y-8 pb-8 w-screen px-6">
      <div className="space-y-2 px-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Your Daily Briefing
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          {data.totalResults} articles curated for you
        </p>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-screen px-14">
          {data.articles.map((article) => (
            <ArticleCard key={article.url} article={article} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={!hasPrevPage || isPlaceholderData}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Page {page} of {totalPages}
            </span>
          </div>

          <Button
            onClick={() => setPage((old) => old + 1)}
            disabled={!hasNextPage || isPlaceholderData}
            size="lg"
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
