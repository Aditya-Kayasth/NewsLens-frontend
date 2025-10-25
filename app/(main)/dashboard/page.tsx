"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/authStore";
import * as api from "@/lib/api";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Glasses, Settings } from "lucide-react";

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

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardNews", user?.email],
    queryFn: () => api.fetchNews(user!.email!, null, 1),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || !user) {
    return <BriefingSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Your Daily Briefing</h2>
        <Card className="p-8 border-destructive/50">
          <p className="text-destructive">
            Error fetching your briefing: {(error as Error).message}
          </p>
        </Card>
      </div>
    );
  }

  if (user.preferred_domains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
          <Glasses className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome to NewsLens!</h2>
        <p className="text-muted-foreground max-w-sm mb-8">
          Let's personalize your news feed. Select topics you're interested in to get started.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/settings">
            <Settings className="h-4 w-4" />
            Choose Your Interests
          </Link>
        </Button>
      </div>
    );
  }

  if (!data || data.articles.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Your Daily Briefing</h2>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No articles found matching your preferences right now. Try adjusting your interests in settings.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Your Daily Briefing</h2>
        <p className="text-muted-foreground text-lg">
          {data.totalResults} articles curated for you
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.articles.map((article) => (
          <ArticleCard key={article.url} article={article} />
        ))}
      </div>
    </div>
  );
}