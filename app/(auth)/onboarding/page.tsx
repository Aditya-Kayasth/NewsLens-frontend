// app/(auth)/onboarding/page.tsx
"use client";

import { TopicPicker } from "@/components/features/onboarding/TopicPicker";
import { useMemo } from "react";

export default function OnboardingPage() {
  const emptyTopics = useMemo(() => [], []);

  return (
    // REVERTED: Removed gradient background
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {/* REVERTED: Removed gradient text */}
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Welcome to NewsLens
          </h1>
          {/* REVERTED: Used muted-foreground for consistency */}
          <p className="text-xl text-muted-foreground">
            One more step to get your personalized news feed
          </p>
        </div>

        {/* Topic Selection */}
        {/* REVERTED: Used card styles, removed custom shadows/borders */}
        <div className="bg-card text-card-foreground rounded-2xl border p-8 md:p-12">
          <div className="text-center mb-8">
            {/* REVERTED: Used foreground text */}
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Choose Your Interests
            </h2>
            {/* REVERTED: Used muted-foreground */}
            <p className="text-muted-foreground">
              Select topics you want to stay updated on
            </p>
          </div>

          <TopicPicker initialTopics={emptyTopics} />
        </div>
      </div>
    </div>
  );
}