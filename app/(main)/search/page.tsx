// app/(main)/search/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

// Skeleton Loader
function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="h-96 animate-pulse bg-muted" />
      ))}
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    // The queryKey now depends on the *submitted* query
    queryKey: ["searchNews", submittedQuery, page],
    queryFn: () => api.searchNews(submittedQuery, page),
    // This is important: only run the query if a search has been submitted
    enabled: submittedQuery !== "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 for a new search
    setSubmittedQuery(query);
  };

  const totalPages = data ? Math.ceil(data.totalResults / 20) : 0;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Search News</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
        <Input
          type="text"
          placeholder="Search for topics, e.g., 'Artificial Intelligence'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <SearchIcon className="h-4 w-4" />
        </Button>
      </form>

      {/* Results Section */}
      <div className="mt-8">
        {isLoading && <SearchSkeleton />}

        {error && (
          <p className="text-rose-500">Error: {(error as Error).message}</p>
        )}

        {submittedQuery && !isLoading && !error && (
          <p className="text-muted-foreground">
            Found {data?.totalResults} results for "{submittedQuery}"
          </p>
        )}

        {data && data.articles.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.articles.map((article) => (
              <ArticleCard key={article.url} article={article} />
            ))}
          </div>
        )}

        {data && data.articles.length === 0 && (
          <p className="mt-6 text-center text-muted-foreground">
            No articles found. Try a different search.
          </p>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalResults > 20 && (
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span>Page {page} of {totalPages}</span>
          <Button
            onClick={() => setPage((old) => old + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}