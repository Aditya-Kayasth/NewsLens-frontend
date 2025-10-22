// app/(main)/settings/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/authStore";
import * as api from "@/lib/api";
import { TopicPicker } from "@/components/features/onboarding/TopicPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuthStore();

  // Fetch the user's current preferences
  const { data, isLoading, error } = useQuery({
    queryKey: ["preferences", user?.email],
    queryFn: () => api.getPreferences(user!.email!),
    enabled: !!user,
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-muted-foreground">
        Manage your account and preferences.
      </p>

      <Tabs defaultValue="profile" className="mt-8">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <Separator className="my-6" />

        <TabsContent value="profile" className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={user?.name} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user?.email} disabled />
          </div>
          <p className="text-sm text-muted-foreground">
            Profile editing is not yet enabled.
          </p>
        </TabsContent>

        <TabsContent value="preferences">
          <h3 className="text-lg font-medium">Manage Topics</h3>
          <p className="text-sm text-muted-foreground">
            Update the topics you're interested in.
          </p>
          {isLoading && <p>Loading preferences...</p>}
          {error && <p className="text-rose-500">Could not load preferences.</p>}
          {data && (
            <TopicPicker
              initialTopics={data.preferred_domains}
              onSuccess={() => {
                toast.success("Preferences updated successfully!");
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}