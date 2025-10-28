"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as api from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";
import { Loader2, Check } from "lucide-react";

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

  useEffect(() => {
    if (JSON.stringify(initialTopics) !== JSON.stringify(selectedTopics)) {
      setSelectedTopics(initialTopics);
    }
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
      if (onSuccess) onSuccess();
      else router.push("/dashboard");
    } catch (error: any) {
      toast.error("Failed to save preferences", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Topic Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {ALL_TOPICS.map((topic) => {
          const isSelected = selectedTopics.includes(topic);
          return (
            <button
              key={topic}
              type="button"
              onClick={() => toggleTopic(topic)}
              className={cn(
                "group relative cursor-pointer rounded-xl border-2 px-4 py-4 sm:px-6 sm:py-5 text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent hover:shadow-md"
              )}
            >
              {/* Animated checkmark for selected state */}
              {isSelected && (
                <span className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg animate-in zoom-in duration-200">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                </span>
              )}
              {topic}
            </button>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-center pt-4">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || selectedTopics.length === 0}
          size="lg"
          className="w-full sm:w-auto sm:min-w-[200px] py-5 sm:py-6 px-6 sm:px-8 rounded-xl font-bold transition-all duration-200 hover:scale-105"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </span>
          ) : (
            `Save Preferences ${
              selectedTopics.length > 0 ? `(${selectedTopics.length})` : ""
            }`
          )}
        </Button>
      </div>
    </div>
  );
}