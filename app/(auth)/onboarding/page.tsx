"use client";

import { TopicPicker } from "@/components/features/onboarding/TopicPicker";
import { useMemo } from "react";

export default function OnboardingPage() {
  const emptyTopics = useMemo(() => [], []);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Welcome to NewsLens
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            One more step to get your personalized news feed
          </p>
        </div>

        {/* Topic Selection */}
        <div className="bg-card text-card-foreground rounded-2xl border shadow-sm p-8 md:p-12">
          <div className="text-center mb-8 space-y-3">
            <h2 className="text-3xl font-bold text-foreground">
              Choose Your Interests
            </h2>
            <p className="text-muted-foreground text-lg">
              Select topics you want to stay updated on
            </p>
          </div>

          <TopicPicker initialTopics={emptyTopics} />
        </div>
      </div>
    </div>
  );
}