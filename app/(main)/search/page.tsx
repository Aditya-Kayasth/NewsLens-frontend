"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="h-[500px] animate-shimmer" />
      ))}
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: ["searchNews", submittedQuery, page],
    queryFn: () => api.searchNews(submittedQuery, page),
    enabled: submittedQuery !== "",
    placeholderData: (previousData) => previousData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setPage(1);
      setSubmittedQuery(query.trim());
    }
  };

  const totalPages = data ? Math.ceil(data.totalResults / 20) : 0;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="space-y-8 pb-8 w-screen">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Search News
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Find articles on any topic that interests you
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-2xl mx-auto gap-2"
        >
          <Input
            type="text"
            placeholder="Search for topics, e.g., 'Artificial Intelligence'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 h-11"
          />
          <Button type="submit" size="lg" disabled={isLoading || !query.trim()}>
            <SearchIcon className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {/* Results Section */}
      <div className="mt-8">
        {isLoading && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">Searching...</p>
            <SearchSkeleton />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-8 max-w-md text-center">
              <p className="text-destructive font-medium mb-2">
                Error searching articles
              </p>
              <p className="text-sm text-muted-foreground">
                {(error as Error).message}
              </p>
            </Card>
          </div>
        )}

        {submittedQuery && !isLoading && !error && data && (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground text-center">
                Found{" "}
                <span className="font-semibold text-foreground">
                  {data.totalResults}
                </span>{" "}
                results for "
                <span className="font-semibold text-foreground">
                  {submittedQuery}
                </span>
                "
              </p>
            </div>

            {data.articles.length > 0 ? (
              <>
                <div className="flex justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 w-screen px-8">
                    {data.articles.map((article) => (
                      <ArticleCard key={article.url} article={article} />
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-8">
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
              </>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <Card className="p-8 max-w-md text-center">
                  <p className="text-muted-foreground">
                    No articles found for "
                    <span className="font-semibold">{submittedQuery}</span>".
                    Try a different search term.
                  </p>
                </Card>
              </div>
            )}
          </>
        )}

        {!submittedQuery && !isLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="p-12 max-w-md text-center">
              <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">
                Enter a search term to find articles
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
