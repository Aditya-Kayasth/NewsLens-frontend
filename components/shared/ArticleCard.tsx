// components/shared/ArticleCard.tsx
import Link from "next/link";
import Image from "next/image";
import { BackendArticle } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  article: BackendArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const getSentiment = (): { label: string; className: string } => {
    if (!article.sentiment) {
      return { label: "Neutral", className: "bg-zinc-500" };
    }
    const polarity = article.sentiment.raw_polarity;
    if (polarity > 0.1) {
      return { label: "Positive", className: "bg-emerald-700" };
    }
    if (polarity < -0.1) {
      return { label: "Negative", className: "bg-rose-700" };
    }
    return { label: "Neutral", className: "bg-zinc-500" };
  };

  const sentiment = getSentiment();
  const publishedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <Link 
        href={`/summarize?url=${encodeURIComponent(article.url)}`} 
        className="group flex h-full flex-col"
      >
        {article.urlToImage ? (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={article.urlToImage}
              alt={article.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-muted text-muted-foreground">
            No Image
          </div>
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2 text-lg group-hover:text-primary">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {article.description}
          </p>
        </CardContent>
        <CardFooter className="mt-auto flex justify-between pt-4 text-xs text-muted-foreground">
          <span className="truncate pr-2">{article.source.name}</span>
          <Badge
            className={`flex-shrink-0 border-none text-white ${sentiment.className}`}
          >
            {sentiment.label}
          </Badge>
        </CardFooter>
      </Link>
    </Card>
  );
}