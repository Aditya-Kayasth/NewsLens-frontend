// app/(auth)/onboarding/page.tsx
"use client";

import { TopicPicker } from "@/components/features/onboarding/TopicPicker";
import { useMemo } from "react"; // <-- 1. IMPORT useMemo

export default function OnboardingPage() {
  
  // 2. CREATE A STABLE EMPTY ARRAY
  // This fixes the infinite loop.
  const emptyTopics = useMemo(() => [], []);

  return (
    <div className="flex w-full flex-col items-center px-4 text-center">
      {/* The double-logo is also fixed here (we removed the extra one) */}
      <h1 className="text-4xl font-bold">Welcome to NewsLens</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Just one more step to get your personalized feed.
      </p>
      <div className="mt-12 w-full">
        <h2 className="text-2xl font-bold">Personalize Your Feed</h2>
        <p className="mt-2 text-muted-foreground">
          Select at least one topic you're interested in.
        </p>
        {/* 3. PASS THE STABLE ARRAY AS THE PROP */}
        <TopicPicker initialTopics={emptyTopics} />
      </div>
    </div>
  );
}