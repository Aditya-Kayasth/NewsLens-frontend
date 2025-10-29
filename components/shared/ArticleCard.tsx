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
import { Button } from "@/components/ui/button";
import { useArticleStore } from "@/lib/articleStore";
import { useRouter } from "next/navigation";

interface ArticleCardProps {
  article: BackendArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const router = useRouter();
  const setSelectedArticle = useArticleStore(
    (state) => state.setSelectedArticle
  );

  const getSubjectivity = (): {
    label: string;
    className: string;
    text: string;
  } => {
    if (!article.sentiment) {
      return { label: "N/A", className: "bg-zinc-500", text: "N/A" };
    }
    const subjectivity = article.sentiment.raw_subjectivity;
    if (subjectivity < 0.5) {
      const percentage = ((1 - subjectivity) * 100).toFixed(0);
      return {
        label: "Fact-Based",
        className: "bg-blue-600 hover:bg-blue-700",
        text: `${percentage}% Factual`,
      };
    } else {
      const percentage = (subjectivity * 100).toFixed(0);
      return {
        label: "Opinion-Based",
        className: "bg-amber-600 hover:bg-amber-700",
        text: `${percentage}% Opinion`,
      };
    }
  };

  const sentiment = getSubjectivity();
  const imageUrl =
    article.urlToImage && article.urlToImage.startsWith("http")
      ? article.urlToImage
      : "/placeholder-news.jpg";

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const handleViewSummary = () => {
    setSelectedArticle(article);
    router.push(`/summarize`);
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-40 sm:h-48 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.srcset = "";
            target.src = "/placeholder-news.jpg";
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Title Section - grows to push footer down */}
      <CardHeader className="grow space-y-2 pb-3">
        <CardTitle className="line-clamp-2 text-base sm:text-lg leading-snug transition-colors duration-200 group-hover:text-primary">
          {article.title}
        </CardTitle>
      </CardHeader>

      {/* Description Section */}
      <CardContent className="pb-3 pt-0">
        <p className="line-clamp-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {article.description || "No description available."}
        </p>
      </CardContent>

      {/* Source and Sentiment Badge - at bottom */}
      <CardFooter className="flex justify-between items-center border-t pt-3 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0 pr-2">
          <span
            className="truncate font-medium text-muted-foreground text-xs"
            title={article.source.name}
          >
            {article.source.name}
          </span>
          {formattedDate && (
            <span className="text-muted-foreground text-xs shrink-0">
              {formattedDate}
            </span>
          )}
        </div>

        <Badge
          title={sentiment.label}
          className={`shrink-0 border-none text-white shadow-sm text-xs ${sentiment.className}`}
        >
          {sentiment.text}
        </Badge>
      </CardFooter>

      {/* Action Buttons - Always Side by Side */}
      <CardFooter className="flex flex-row justify-between items-stretch gap-2 border-t pt-3">
        <Button
          onClick={handleViewSummary}
          variant="outline"
          size="sm"
          className="flex-1 transition-all hover:scale-105 text-xs sm:text-sm"
        >
          Summary
        </Button>

        <Button
          asChild
          size="sm"
          className="flex-1 transition-all hover:scale-105 text-xs sm:text-sm"
        >
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read Full
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}