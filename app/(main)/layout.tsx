// app/(main)/layout.tsx
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <div className="container max-w-7xl py-8">{children}</div>
      </div>
      <Footer />
    </div>
  );
}