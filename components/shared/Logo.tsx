// components/shared/Logo.tsx
import Link from "next/link";
import { Glasses } from "lucide-react"; // Using an icon

export function Logo() {
  return (
    <Link
      href="/dashboard"
      className="group flex items-center gap-2 text-xl font-bold text-primary"
    >
      <div className="rounded-lg bg-primary p-2 text-primary-foreground transition-all group-hover:scale-110">
        <Glasses size={20} />
      </div>
      <span className="text-foreground transition-colors group-hover:text-primary">
        NewsLens
      </span>
    </Link>
  );
}