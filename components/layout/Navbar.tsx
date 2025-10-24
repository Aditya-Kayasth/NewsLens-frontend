// components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "./ThemeToggle"; // Import ThemeToggle

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
    { href: "/discover", label: "Discover" },
    { href: "/settings", label: "Settings" },
  ];

  const activeLinkClass = "text-primary border-b-2 border-primary";
  const defaultLinkClass = "text-foreground/60 hover:text-foreground";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 md:flex">
          {/* Render the Logo directly (it's already a link) */}
          <div className="mr-6 flex items-center space-x-2">
            <Logo />
            {/* Optionally keep the text next to it, if desired */}
            {/* <span className="inline-block font-bold">NewsLens</span> */}
          </div>
          {user && (
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    pathname.startsWith(link.href)
                      ? activeLinkClass
                      : defaultLinkClass
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search component could go here if you want it in the navbar */}
          </div>
          <nav className="flex items-center space-x-2">
            {user ? (
              <>
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Search...
                </Button>
                <Button variant="ghost">{user.email.split("@")[0]}</Button>
                <Button variant="ghost" onClick={handleLogout}>
                  Log Out
                </Button>
                <ThemeToggle /> {/* Add ThemeToggle here */}
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
                <ThemeToggle /> {/* Add ThemeToggle here as well */}
              </>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
}
