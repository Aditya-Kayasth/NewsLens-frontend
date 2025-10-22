// app/(auth)/layout.tsx
import { Logo } from "@/components/shared/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="mb-8">
        <Logo />
      </div>
      {children}
    </div>
  );
}