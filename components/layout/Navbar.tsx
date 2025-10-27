"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import  ThemeToggle from "./ThemeToggle"
import { cn } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/search", label: "Search" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full px-16 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 md:flex">
          <div className="mr-6 flex items-center space-x-2">
            <Logo />
          </div>
          {user && (
            <nav className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname.startsWith(link.href)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {link.label}
                  {pathname.startsWith(link.href) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="hidden sm:inline-flex font-medium cursor-pointer"
                >
                  {user.name}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="hover:text-destructive cursor-pointer"
                >
                  Log Out
                </Button>
                <ThemeToggle />
              </>
            ) : (
              <>
                <Link href="/login" className="">
                  <Button variant="ghost" className="cursor-pointer">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="cursor-pointer">Sign Up</Button>
                </Link>
                <ThemeToggle />
              </>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
}