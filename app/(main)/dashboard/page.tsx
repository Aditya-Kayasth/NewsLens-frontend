// app/(main)/dashboard/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/authStore";
import * as api from "@/lib/api";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArticleSentiment } from "@/components/features/article/ArticleSentiment";
import { BackendArticle } from "@/types";

// Skeleton Loader
function BriefingSkeleton() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Your Daily Briefing</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="h-96 animate-pulse bg-muted" />
        ))}
      </div>
    </div>
  );
}

// Sentiment Snapshot Component (moved inline for simplicity)
function SentimentSnapshot({ articles }: { articles: BackendArticle[] }) {
  const validSentiments = articles
    .map(a => a.sentiment)
    .filter(s => s !== null) as { raw_polarity: number, raw_subjectivity: number }[];

  if (validSentiments.length === 0) {
    return <p className="text-muted-foreground">Not enough data for a sentiment snapshot.</p>;
  }

  const avgPolarity = validSentiments.reduce((acc, s) => acc + s.raw_polarity, 0) / validSentiments.length;
  const avgSubjectivity = validSentiments.reduce((acc, s) => acc + s.raw_subjectivity, 0) / validSentiments.length;

  const mockSentiment = {
    raw_polarity: avgPolarity,
    raw_subjectivity: avgSubjectivity
  };

  return <ArticleSentiment sentiment={mockSentiment} />;
}

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardNews", user?.email],
    queryFn: () => api.fetchNews(user!.email!, null, 1),
    enabled: !!user, // Only run if the user is loaded
  });

  if (isLoading || !user) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Your Daily Briefing</h2>
        <BriefingSkeleton />
      </div>
    );
  }

  if (error) {
    return <p className="text-rose-500">Error: {(error as Error).message}</p>;
  }

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

  if (!data || data.articles.length === 0) {
    return <p>No articles found for your preferences.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <h2 className="text-2xl font-bold">Your Daily Briefing</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {data.articles.map((article) => (
            <ArticleCard key={article.url} article={article} />
          ))}
        </div>
      </div>
      <aside className="space-y-8 lg:col-span-1">
        <h2 className="text-2xl font-bold">Sentiment Snapshot</h2>
        <SentimentSnapshot articles={data.articles} />
      </aside>
    </div>
  );
}