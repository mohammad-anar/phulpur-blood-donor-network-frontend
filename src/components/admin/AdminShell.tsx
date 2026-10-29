"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, Phone, KeyRound, ArrowRight, RefreshCw, Home } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { getStoredToken, getStoredUser, authApi, AuthUser } from "@/lib/api/auth";
import { useToast } from "@/components/common/Toast";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Quick Login States
  const [identifier, setIdentifier] = useState("01972606255");
  const [password, setPassword] = useState("@Hridoy7060@");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { success, error } = useToast();

  const checkAuth = () => {
    const token = getStoredToken();
    const user = getStoredUser();
    if (token && user && (user.role === "ADMIN" || user.role === "SUPERADMIN")) {
      setAuthUser(user);
    } else {
      setAuthUser(null);
    }
    setIsCheckingAuth(false);
  };

  useEffect(() => {
    checkAuth();
    const handleAuthChange = () => checkAuth();
    window.addEventListener("phulpur-auth-change", handleAuthChange);
    return () => window.removeEventListener("phulpur-auth-change", handleAuthChange);
  }, []);

  const handleAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);
    try {
      const res = await authApi.login({ identifier, password });
      if (res.user.role === "ADMIN" || res.user.role === "SUPERADMIN") {
        setAuthUser(res.user);
        success(`স্বাগতম, ${res.user.name}! অ্যাডমিন এক্সেস অনুমোদিত হয়েছে।`, "লগইন সফল");
      } else {
        error("আপনার অ্যাকাউন্টটিতে অ্যাডমিন বা সুপারঅ্যাডমিন রোল নেই।", "অননুমোদিত");
      }
    } catch (err: any) {
      error(err?.message || "লগইন ব্যর্থ হয়েছে। ক্রেডেনশিয়াল পরীক্ষা করুন।", "লগইন ত্রুটি");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
          <RefreshCw className="w-5 h-5 animate-spin text-[var(--color-primary)]" />
          <span>অ্যাডমিন নিরাপত্তা যাচাই হচ্ছে...</span>
        </div>
      </div>
    );
  }

  // If unauthenticated or not an admin, show the admin login barrier
  if (!authUser) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center items-center p-4 sm:p-6 text-[var(--foreground)]">
        <div className="max-w-md w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-[var(--color-primary)] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">অ্যাডমিন এক্সেস পোর্টাল</h1>
            <p className="text-xs text-[var(--foreground-muted)]">
              ফুলপুর ব্লাড ডোনার নেটওয়ার্কের কেন্দ্রীয় প্রশাসনিক তথ্য ও যাচাই ব্যবস্থা
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[var(--foreground-muted)] mb-1">
                অ্যাডমিন মোবাইল বা ইমেইল
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="01972606255"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[var(--background-alt)] rounded-xl border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[var(--foreground-muted)] mb-1">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[var(--background-alt)] rounded-xl border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>যাচাই হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>লগইন করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="p-3.5 rounded-2xl bg-[var(--background-alt)] border border-[var(--border-color)] text-[11px] space-y-1.5">
            <span className="font-bold text-[var(--foreground)] block">
              ডিফল্ট সুপার অ্যাডমিন ক্রেডেনশিয়াল:
            </span>
            <div className="flex justify-between text-[var(--foreground-muted)]">
              <span>নাম:</span>
              <span className="font-semibold text-[var(--foreground)]">Hridoy Hassan</span>
            </div>
            <div className="flex justify-between text-[var(--foreground-muted)]">
              <span>মোবাইল:</span>
              <span className="font-mono text-[var(--foreground)]">01972606255 / 880 1972-606255</span>
            </div>
            <div className="flex justify-between text-[var(--foreground-muted)]">
              <span>ইমেইল:</span>
              <span className="font-mono text-[var(--foreground)]">bonnochobi@gmail.com</span>
            </div>
            <div className="flex justify-between text-[var(--foreground-muted)]">
              <span>পাসওয়ার্ড:</span>
              <span className="font-mono text-[var(--foreground)]">@Hridoy7060@</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] hover:text-[var(--color-primary)]"
            >
              <Home className="w-3.5 h-3.5" />
              <span>মূল ওয়েবসাইটে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex text-[var(--foreground)] transition-colors duration-200">
      {/* Sidebar */}
      <AdminSidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
