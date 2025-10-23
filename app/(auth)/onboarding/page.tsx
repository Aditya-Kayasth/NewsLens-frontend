// app/(auth)/onboarding/page.tsx
"use client";

import { TopicPicker } from "@/components/features/onboarding/TopicPicker";
// We no longer import Logo here

export default function OnboardingPage() {
  return (
    <div className="flex w-full flex-col items-center px-4 text-center">
      {/* The logo from the layout file is now the only one */}
      <h1 className="text-4xl font-bold">Welcome to NewsLens</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Just one more step to get your personalized feed.
      </p>
      <div className="mt-12 w-full">
        <h2 className="text-2xl font-bold">Personalize Your Feed</h2>
        <p className="mt-2 text-muted-foreground">
          Select at least one topic you're interested in.
        </p>
        <TopicPicker />
      </div>
    </div>
  );
}