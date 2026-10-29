"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  PhoneCall,
  ChevronDown,
  User,
  ShieldCheck,
  LogOut,
  KeyRound,
  LayoutDashboard,
} from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/lib/api/useAuth";
import { getAssetUrl } from "@/lib/api/auth";

interface NavbarProps {
  onOpenRegisterModal?: () => void;
  onOpenSearchScroll?: () => void;
}

export function Navbar({ onOpenRegisterModal, onOpenSearchScroll }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Determine active nav from current URL pathname
  const getActiveId = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(event.target as Node)
      ) {
        setLoginDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks: { id: string; label: string; href: string; onClick?: () => void }[] = [
    { id: "home", label: "হোম", href: "/" },
    { id: "search", label: "ডোনার খুঁজুন", href: "/donors" },
    { id: "about", label: "আমাদের সম্পর্কে", href: "/about" },
    { id: "contact", label: "যোগাযোগ", href: "/contact" },
  ];

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--card-bg)]/95 backdrop-blur-md border-b border-[var(--border-color)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-lg p-1"
        >
          <div className="relative h-12 sm:h-13 w-44 sm:w-56 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/ফুলপুর ব্লাড ডোনার নেটওয়ার্ক লোগো cropped.png"
              alt="ফুলপুর ব্লাড ডোনার নেটওয়ার্ক"
              fill
              sizes="(max-width: 640px) 176px, 224px"
              className="object-contain object-left dark:bg-white/95 dark:px-2 dark:py-1 dark:rounded-xl"
              priority
            />
          </div>
          <div className="hidden xl:flex flex-col border-l border-[var(--border-color)] pl-3 py-0.5">
            <span className="text-[11px] font-bold text-[var(--color-primary)] leading-tight">
              রক্ত দিন
            </span>
            <span className="text-[11px] text-[var(--foreground-muted)] font-medium leading-tight">
              জীবন বাঁচান
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-5 text-[14px] lg:text-[15px] font-medium text-[var(--foreground-muted)]">
          {navLinks.map((link) => {
            const isActive = getActiveId(link.href);

            if (link.href.startsWith("/")) {
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`relative py-2 px-2 transition-colors duration-200 hover:text-[var(--color-primary)] cursor-pointer ${
                    isActive
                      ? "text-[var(--color-primary)] font-semibold"
                      : "text-[var(--foreground-muted)]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[var(--color-primary)] rounded-full transition-all" />
                  )}
                </Link>
              );
            }

            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
                className={`relative py-2 px-2 transition-colors duration-200 hover:text-[var(--color-primary)] cursor-pointer ${
                  isActive
                    ? "text-[var(--color-primary)] font-semibold"
                    : "text-[var(--foreground-muted)]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[var(--color-primary)] rounded-full transition-all" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Authenticated User Menu vs Login/Register */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-3 rounded-full border border-[var(--border-color)] bg-[var(--background-alt)] hover:border-[var(--color-primary)] transition-all cursor-pointer"
              >
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-[var(--foreground)] leading-tight truncate max-w-[100px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-[var(--color-primary)] font-semibold uppercase">
                    {user.role} {user.bloodGroup ? `(${user.bloodGroup})` : ""}
                  </div>
                </div>
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[var(--color-primary)] shrink-0">
                  <Image
                    src={getAssetUrl(user.profileImage)}
                    alt={user.name}
                    fill
                    unoptimized={Boolean(user.profileImage?.startsWith("http"))}
                    className="object-cover"
                  />
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[var(--foreground-muted)] transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--card-bg)] rounded-2xl shadow-xl border border-[var(--border-color)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-[var(--border-subtle)] mb-1">
                    <p className="text-xs font-bold text-[var(--foreground)] truncate">{user.name}</p>
                    <p className="text-[11px] text-[var(--foreground-muted)] truncate">{user.phone}</p>
                  </div>

                  <Link
                    href="/donor"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--background-alt)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>ডোনার ড্যাশবোর্ড</span>
                  </Link>

                  <Link
                    href="/change-password"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--background-alt)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>পাসওয়ার্ড পরিবর্তন</span>
                  </Link>

                  {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>অ্যাডমিন প্যানেল</span>
                    </Link>
                  )}

                  <div className="pt-1 mt-1 border-t border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>লগআউট করুন</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Login Dropdown */}
              <div className="relative" ref={loginDropdownRef}>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-lg transition-all duration-200 cursor-pointer shadow-xs"
                >
                  <User className="w-4 h-4" />
                  <span>লগইন</span>
                </Link>
              </div>

              {/* Sign Up Button (Solid Blood Red) */}
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] rounded-lg transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02]"
              >
                নিবন্ধন করুন
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu & Theme button */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] border border-[var(--border-color)] cursor-pointer"
            aria-label="মেনু খুলুন"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--card-bg)] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isRoute = link.href.startsWith("/");
              if (isRoute) {
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                      getActiveId(link.href)
                        ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold"
                        : "text-[var(--foreground-muted)] hover:bg-[var(--background-alt)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    if (link.onClick) {
                      e.preventDefault();
                      link.onClick();
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    getActiveId(link.href)
                      ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold"
                      : "text-[var(--foreground-muted)] hover:bg-[var(--background-alt)]"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[var(--border-color)] flex flex-col gap-2.5">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[var(--background-alt)] flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--color-primary)]">
                    <Image
                      src={getAssetUrl(user.profileImage)}
                      alt={user.name}
                      fill
                      unoptimized={Boolean(user.profileImage?.startsWith("http"))}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--foreground)] truncate">{user.name}</p>
                    <p className="text-xs text-[var(--foreground-muted)] truncate">{user.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/donor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 rounded-lg text-xs font-bold text-center text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
                  >
                    ড্যাশবোর্ড
                  </Link>
                  <Link
                    href="/change-password"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 rounded-lg text-xs font-bold text-center text-[var(--foreground)] border border-[var(--border-color)] hover:bg-[var(--background-alt)]"
                  >
                    পাসওয়ার্ড বদল
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50"
                >
                  লগআউট করুন
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-center text-xs sm:text-sm font-semibold text-[var(--color-primary)] border border-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-light)] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>লগইন</span>
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-center text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/50 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>অ্যাডমিন লগইন</span>
                  </Link>
                </div>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-lg block"
                >
                  নিবন্ধন করুন
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
