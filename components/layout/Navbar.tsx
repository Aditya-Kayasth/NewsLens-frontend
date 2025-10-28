"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/search", label: "Search" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        {user && (
          <nav className="hidden md:flex items-center space-x-1 mx-auto">
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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          {user ? (
            <>
              <Button variant="ghost" className="font-medium cursor-pointer">
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
              <Link href="/login">
                <Button variant="ghost" className="cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="cursor-pointer">Sign Up</Button>
              </Link>
              <ThemeToggle />
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t space-y-2">
              <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
                {user.name}
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start hover:text-destructive cursor-pointer"
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}