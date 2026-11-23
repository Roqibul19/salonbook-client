"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";
import Logo from "./Logo";
import Avatar from "./Avatar";
import { signOut, useSession } from "@/lib/auth-client";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // close menus when the route changes
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setDropdownOpen(false);
  }

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/");
          router.refresh();
        },
        onError: () => {
          toast.error("Logout failed. Please try again.");
        },
      },
    });
  };

  const links = user
    ? [...publicLinks, { href: "/dashboard", label: "Dashboard" }]
    : publicLinks;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand-600 ${
                  isActive(link.href) ? "text-brand-600" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {isPending ? (
            <span className="h-9 w-24 animate-pulse rounded-full bg-brand-50" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-brand-50"
                aria-label="Open profile menu"
              >
                <Avatar name={user.name} image={user.image} />
                <ChevronDown className="h-4 w-4 text-muted" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-white shadow-lg">
                  <div className="border-b border-line px-4 py-3">
                    <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink hover:bg-brand-50"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/signin"
                className="rounded-full px-4 py-2 text-sm font-medium text-ink transition hover:bg-brand-50"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* mobile menu button */}
          <button
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg p-2 text-ink hover:bg-brand-50 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      {mobileOpen && (
        <div className="border-t border-line bg-white px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive(link.href) ? "bg-brand-50 text-brand-600" : "text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {!user && !isPending && (
              <>
                <li>
                  <Link href="/signin" className="block rounded-lg px-3 py-2 text-sm font-medium text-ink">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="mt-1 block rounded-lg bg-brand-600 px-3 py-2 text-center text-sm font-medium text-white"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
