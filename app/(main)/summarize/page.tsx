// app/(main)/summarize/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ExternalLink, List } from "lucide-react";

function SummarySkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="h-10 w-3/4 animate-pulse rounded-lg bg-muted"></div>
      <div className="space-y-2">
        <div className="h-6 w-full animate-pulse rounded-lg bg-muted"></div>
        <div className="h-6 w-full animate-pulse rounded-lg bg-muted"></div>
        <div className="h-6 w-5/6 animate-pulse rounded-lg bg-muted"></div>
      </div>
      <div className="h-10 w-1/4 animate-pulse rounded-lg bg-muted"></div>
    </div>
  );
}

export default function SummarizePage() {
  const searchParams = useSearchParams();
  const articleUrl = searchParams.get("url");

  const { data, isLoading, error } = useQuery({
    queryKey: ["summarize", articleUrl],
    queryFn: () => api.fetchSummary(articleUrl!),
    enabled: !!articleUrl,
  });

  if (!articleUrl) {
    return <p>No article URL provided.</p>;
  }

  if (isLoading) {
    return <SummarySkeleton />;
  }

  if (error) {
    return <p className="text-rose-500">Error: {(error as Error).message}</p>;
  }

  if (!data || data.articles.length === 0) {
    return <p>Could not generate a summary for this article.</p>;
  }

  const summary = data.articles[0];

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">AI-Generated Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>{summary.description}</p>
          </div>
        </CardContent>
      </Card>

      <Button asChild>
        <a href={articleUrl} target="_blank" rel="noopener noreferrer">
          Read Full Original Article <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>

      {summary.info && summary.info.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <List className="h-5 w-5" />
              Sources Used for Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5">
              {summary.info.map((info) => (
                <li key={info.url}>
                  <a
                    href={info.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:opacity-80"
                  >
                    {info.title}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </article>
  );
}