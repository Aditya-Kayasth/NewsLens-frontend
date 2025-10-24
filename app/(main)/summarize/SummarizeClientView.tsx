// app/(main)/summarize/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ExternalLink, List, FileText } from "lucide-react";
import { useArticleStore } from "@/lib/articleStore"; // <-- 1. IMPORT
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

function SummarySkeleton() {
  // ... (Skeleton code remains the same)
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
  // 2. GET ARTICLE FROM STORE, NOT URL
  const router = useRouter();
  const article = useArticleStore((state) => state.selectedArticle);
  const articleUrl = article?.url; // Get URL from the stored article

  // 3. REDIRECT IF STATE IS EMPTY (e.g., page refresh)
  useEffect(() => {
    if (!article) {
      router.replace("/dashboard");
    }
  }, [article, router]);

  // 4. Run the summary query
  const { data, isLoading, error } = useQuery({
    queryKey: ["summarize", articleUrl],
    queryFn: () => api.fetchSummary(articleUrl!),
    enabled: !!articleUrl,
  });

  // 5. Show loading state *before* checking for article
  if (isLoading || !article) {
    return <SummarySkeleton />;
  }

  if (error) {
    return <p className="text-rose-500">Error: {(error as Error).message}</p>;
  }

  if (!data || data.articles.length === 0) {
    return <p>Could not generate a summary for this article.</p>;
  }

  const summary = data.articles[0];
  const imageUrl = article.urlToImage && article.urlToImage.startsWith('http') 
    ? article.urlToImage 
    : '/placeholder-news.jpg';

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      
      {/* 6. ADDED ARTICLE DETAILS TO THE SUMMARY PAGE */}
      <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
        {article.title}
      </h1>
      <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={article.title}
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* AI Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
            <FileText className="h-6 w-6" />
            AI-Generated Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>{summary.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Read Full Article Button */}
      <Button asChild size="lg" className="w-full">
        <a href={articleUrl} target="_blank" rel="noopener noreferrer">
          Read Full Original Article <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>

      {/* Sources Card */}
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