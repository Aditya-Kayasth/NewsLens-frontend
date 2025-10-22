// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { Logo } from "@/components/shared/Logo";

export default function RootPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    // We check this on the client side after the store has rehydrated
    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [token, router]);

  // Show a simple loading state while redirecting
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4">
      <Logo />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}