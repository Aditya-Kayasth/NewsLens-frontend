// components/features/onboarding/TopicPicker.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as api from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";
import { Loader2 } from "lucide-react";

// Clean array with no invisible characters
const ALL_TOPICS = [
  "Technology", "Science", "Music", "Travel", "Sports",
  "Entertainment", "Business", "World", "Health", "Politics",
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

  useEffect(() => {
    // Only update if the prop actually changes to avoid potential loops
     if (JSON.stringify(initialTopics) !== JSON.stringify(selectedTopics)) {
        setSelectedTopics(initialTopics);
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTopics]); // Keep only initialTopics here

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = async () => {
    // ... (handleSubmit logic remains the same)
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
      if (onSuccess) onSuccess();
      else router.push("/dashboard");
    } catch (error: any) {
      toast.error("Failed to save preferences", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Topic Grid */}
      <div className="my-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {ALL_TOPICS.map((topic) => {
          const isSelected = selectedTopics.includes(topic);
          return (
            <button
              key={topic}
              type="button"
              onClick={() => toggleTopic(topic)}
              className={cn(
                "cursor-pointer rounded-lg border px-6 py-4 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground" // Selected: Primary color background, foreground text
                  // --- THIS IS THE FIX for UNSELECTED state ---
                  : "border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  // Use border-input (visible border)
                  // Use bg-transparent (inherits card background)
                  // Use text-muted-foreground (visible gray text)
                  // Standard hover effects
              )}
            >
              {topic}
            </button>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="mt-12 flex justify-center">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || selectedTopics.length === 0}
          size="lg"
          className="min-w-[200px] py-6 px-8 rounded-xl font-bold transition-all duration-200"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </span>
          ) : (
            `Save Preferences ${selectedTopics.length > 0 ? `(${selectedTopics.length})` : ''}`
          )}
        </Button>
      </div>
    </div>
  );
}