// components/features/onboarding/TopicPicker.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as api from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";

const ALL_TOPICS = [
  "Technology",
  "Science",
  "Music",
  "Travel",
  "Sports",
  "Entertainment",
  "Business",
  "World",
  "Health",
  "Politics",
];

interface TopicPickerProps {
  initialTopics?: string[];
  onSuccess?: () => void;
}

export function TopicPicker({
  initialTopics = [],
  onSuccess,
}: TopicPickerProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialTopics);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  // This effect now safely runs when the *stable* prop changes
  useEffect(() => {
    setSelectedTopics(initialTopics);
  }, [initialTopics]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in.");
      return;
    }
    if (selectedTopics.length === 0) {
      toast.error("Please select at least one topic.");
      return;
    }

    setIsLoading(true);
    try {
      await api.updatePreferences(user.email, selectedTopics);
      setUser({ ...user, preferred_domains: selectedTopics });
      toast.success("Preferences Saved!");

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error("Failed to save preferences", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* THIS DIV CONTAINS *ONLY* THE TOPICS */}
      <div className="my-6 flex flex-wrap justify-center gap-3">
        {ALL_TOPICS.map((topic) => {
          const isSelected = selectedTopics.includes(topic);
          return (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-transparent hover:bg-accent"
              )}
            >
              {topic}
            </button>
          );
        })}
      </div>

      {/* THIS IS THE SEPARATE, STYLED <Button> COMPONENT */}
      {/* This fixes the hydration error and the layout. */}
      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="mt-8 w-full"
        size="lg"
      >
        {isLoading ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  );
}
