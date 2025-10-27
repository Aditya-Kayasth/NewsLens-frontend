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

  const handleViewDescription = () => {
    setSelectedArticle(article);
    router.push(`/article`);
  };

  const handleViewSummary = () => {
    setSelectedArticle(article);
    router.push(`/summarize`);
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Enhanced Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
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
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardHeader className="grow space-y-2">
        <CardTitle className="line-clamp-2 text-lg leading-snug transition-colors duration-200 group-hover:text-primary">
          {article.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
          {article.description || "No description available."}
        </p>
      </CardContent>

      {/* Sentiment Badge */}
      <CardFooter className="mt-auto flex justify-between items-center pt-4 text-xs text-muted-foreground border-t">
        <span className="truncate pr-2 font-medium">{article.source.name}</span>
        <Badge
          title={sentiment.label}
          className={`shrink-0 border-none text-white shadow-sm ${sentiment.className}`}
        >
          {sentiment.text}
        </Badge>
      </CardFooter>

      {/* Action Buttons */}
      <CardFooter className="flex justify-between items-center gap-2 pt-4 border-t">
        <Button
          onClick={handleViewDescription}
          variant="secondary"
          className="flex-1 transition-all hover:scale-105"
        >
          Details
        </Button>

        <Button
          onClick={handleViewSummary}
          variant="outline"
          className="flex-1 transition-all hover:scale-105"
        >
          Summary
        </Button>

        <Button asChild className="flex-1 transition-all hover:scale-105">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read Full
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
