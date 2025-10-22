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
        {/* THIS IS THE IMPORTANT LINE: */}
        <div className="container max-w-full py-8 px-6">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
