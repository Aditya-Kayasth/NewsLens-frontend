// app/(main)/article/page.tsx
"use client";

import { useArticleStore } from "@/lib/articleStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // Keep Link for View Summary button

export default function ArticleDetailsPage() {
  const router = useRouter();
  const article = useArticleStore((state) => state.selectedArticle);

  useEffect(() => {
    if (!article) {
      router.replace("/dashboard");
    }
  }, [article, router]);

  if (!article) {
    return (
      <div className="flex items-center justify-center py-12">
        <p>Loading article or redirecting...</p>
      </div>
    );
  }

  const imageUrl = article.urlToImage && article.urlToImage.startsWith('http')
    ? article.urlToImage
    : '/placeholder-news.jpg';

  const publishedDate = new Date(article.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Function to handle clicking the summary button
  // Ensures the article state is already set before navigating
  const handleViewSummary = () => {
    if(article) {
        router.push('/summarize');
    } else {
        // Fallback or show error if article state is somehow lost
        router.push('/dashboard');
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
        {article.title}
      </h1>
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
        <span>{article.source.name}</span>
        <span>&bull;</span>
        <span>{publishedDate}</span>
        {/* Add Author here if available:
        {article.author && <span>&bull;</span>}
        {article.author && <span>{article.author}</span>}
        */}
      </div>
      <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-lg mb-6">
        <Image
          src={imageUrl}
          alt={article.title}
          layout="fill"
          objectFit="cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.srcset = '';
            target.src = '/placeholder-news.jpg';
          }}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Article Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed text-foreground/80">
            {article.description || "No description available."}
          </p>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Button asChild size="lg" className="flex-1">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read Full Article
          </a>
        </Button>
        {/* Use the handler for the summary button */}
        <Button onClick={handleViewSummary} variant="outline" size="lg" className="flex-1">
            View AI Summary
        </Button>
      </div>
    </div>
  );
}