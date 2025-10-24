// components/shared/ArticleCard.tsx
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

  const getSubjectivity = (): { label: string; className: string; text: string } => {
    if (!article.sentiment) {
      return { label: "N/A", className: "bg-zinc-500", text: "N/A" };
    }
    const subjectivity = article.sentiment.raw_subjectivity;
    if (subjectivity < 0.5) {
      const percentage = ((1 - subjectivity) * 100).toFixed(2);
      return {
        label: "Fact-Based",
        className: "bg-blue-600 hover:bg-blue-700",
        text: `Fact-Based (${percentage}%)`,
      };
    } else {
      const percentage = (subjectivity * 100).toFixed(2);
      return {
        label: "Opinion-Based",
        className: "bg-amber-600 hover:bg-amber-700",
        text: `Opinion-Based (${percentage}%)`,
      };
    }
  };

  const sentiment = getSubjectivity();
  const imageUrl =
    article.urlToImage && article.urlToImage.startsWith("http")
      ? article.urlToImage
      : "/placeholder-news.jpg";

  // Handler for viewing the description page
  const handleViewDescription = () => {
    setSelectedArticle(article);
    router.push(`/article`);
  };

  // Handler for viewing the summary page
  const handleViewSummary = () => {
    setSelectedArticle(article);
    router.push(`/summarize`);
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={article.title}
          layout="fill"
          objectFit="cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.srcset = "";
            target.src = "/placeholder-news.jpg";
          }}
        />
      </div>
      <CardHeader className="grow">
        {/* Title is NOT clickable anymore */}
        <CardTitle className="line-clamp-2 text-lg">
            {article.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {article.description || "No description available."}
        </p>
      </CardContent>
      {/* Sentiment Badge */}
      <CardFooter className="mt-auto flex justify-between items-center pt-4 text-xs text-muted-foreground">
        <span className="truncate pr-2">{article.source.name}</span>
        <Badge
          title={sentiment.label}
          className={`shrink-0 border-none text-white ${sentiment.className}`}
        >
          {sentiment.text}
        </Badge>
      </CardFooter>

      {/* Action Buttons */}
      <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t mt-0">
        {/* Description Button */}
        <Button onClick={handleViewDescription} variant="secondary" className="w-full">
          Description
        </Button>
        {/* Summarize Button */}
        <Button onClick={handleViewSummary} variant="outline" className="w-full">
          Summarize
        </Button>
        {/* Read Full Article Button */}
        <Button asChild className="w-full">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read Full Article
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}