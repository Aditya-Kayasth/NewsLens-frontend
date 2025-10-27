"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/authStore";
import * as api from "@/lib/api";
import { TopicPicker } from "@/components/features/onboarding/TopicPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["preferences", user?.email],
    queryFn: () => api.getPreferences(user!.email!),
    enabled: !!user,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Manage your account and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="mt-8">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <Separator className="my-6" />

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user?.name} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} disabled />
              </div>
              <p className="text-sm text-muted-foreground pt-2">
                Profile editing is not yet enabled.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Manage Topics</h3>
              <p className="text-sm text-muted-foreground">
                Update the topics you're interested in to personalize your news feed.
              </p>
            </div>
            
            {isLoading && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Loading preferences...</p>
              </Card>
            )}
            
            {error && (
              <Card className="p-8 text-center border-destructive/50">
                <p className="text-destructive">Could not load preferences.</p>
              </Card>
            )}
            
            {data && (
              <TopicPicker
                initialTopics={data.preferred_domains}
                onSuccess={() => {
                  toast.success("Preferences updated successfully!");
                }}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}