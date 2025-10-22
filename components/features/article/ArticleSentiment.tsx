// components/features/article/ArticleSentiment.tsx
"use client";

import { BackendArticle } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface ArticleSentimentProps {
  sentiment: BackendArticle["sentiment"];
}

const COLORS_POLARITY = ["#10b981", "#f43f5e", "#6b7280"]; // Emerald, Rose, Zinc
const COLORS_SUBJECTIVITY = ["#3b82f6", "#a8a29e"]; // Blue, Stone

export function ArticleSentiment({ sentiment }: ArticleSentimentProps) {
  if (!sentiment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sentiment data is not available for this article.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { raw_polarity, raw_subjectivity } = sentiment;

  // Polarity Data
  const polarityLabel =
    raw_polarity > 0.1
      ? "Positive"
      : raw_polarity < -0.1
      ? "Negative"
      : "Neutral";
  
  const polarityData = [
    { name: "Positive", value: raw_polarity > 0 ? raw_polarity : 0 },
    { name: "Negative", value: raw_polarity < 0 ? Math.abs(raw_polarity) : 0 },
    { name: "Neutral", value: (raw_polarity <= 0.1 && raw_polarity >= -0.1) ? 1 : 0 }
  ].filter(item => item.value > 0); // Only show relevant parts

  // Subjectivity Data
  const subjectivityLabel = raw_subjectivity > 0.5 ? "Subjective" : "Objective";
  const subjectivityData = [
    { name: "Subjective", value: raw_subjectivity },
    { name: "Objective", value: 1 - raw_subjectivity },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Polarity</CardTitle>
        </CardHeader>
        <CardContent className="h-48">
          <p className="mb-4 text-center text-lg font-medium">
            Overall: <span className={
              polarityLabel === "Positive" ? "text-emerald-500" :
              polarityLabel === "Negative" ? "text-rose-500" : "text-zinc-500"
            }>{polarityLabel}</span>
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={polarityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
              >
                {polarityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_POLARITY[index % COLORS_POLARITY.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment Subjectivity</CardTitle>
        </CardHeader>
        <CardContent className="h-48">
          <p className="mb-4 text-center text-lg font-medium">
            Overall: <span className="text-blue-500">{subjectivityLabel}</span>
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={subjectivityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
              >
                {subjectivityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_SUBJECTIVITY[index % COLORS_SUBJECTIVITY.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${(value * 100).toFixed(0)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}