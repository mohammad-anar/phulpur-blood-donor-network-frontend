"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  LogIn,
  Heart,
  AlertCircle,
  ArrowRight,
  Phone,
  Mail,
  Lock,
} from "lucide-react";
import { authApi, ApiError } from "@/lib/api/auth";
import { useToast } from "@/components/common/Toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LoginPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<"donor" | "admin">("donor");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setErrorMessage("মোবাইল নম্বর বা ইমেইল ঠিকানা প্রদান করুন");
      return;
    }
    if (!password) {
      setErrorMessage("আপনার অ্যাকাউন্টের পাসওয়ার্ড লিখুন");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.login({
        identifier: trimmedId,
        password,
      });

      success(`স্বাগতম, ${res.user.name || "ব্যবহারকারী"}!`, "সফল লগইন");

      // Redirect based on role
      if (res.user.role === "ADMIN" || res.user.role === "SUPERADMIN") {
        router.push("/admin");
      } else {
        router.push("/donor");
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
        error(err.message, "লগইন ব্যর্থ");
      } else {
        const msg = err?.message || "লগইন করা সম্ভব হয়নি। তথ্য সঠিক কিনা যাচাই করুন।";
        setErrorMessage(msg);
        error(msg, "লগইন ব্যর্থ");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle decorative blood drop background accents */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full space-y-6 relative z-10">
          {/* Header Card */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] shadow-sm">
              <Heart className="w-8 h-8 fill-current animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
              অ্যাকাউন্টে প্রবেশ করুন
            </h1>
            <p className="text-sm text-[var(--foreground-muted)] max-w-sm mx-auto">
              ফুলপুর ব্লাড ডোনার নেটওয়ার্কের নিরাপদ সিস্টেমে লগইন করুন
            </p>
          </div>

          {/* Tab Selector: Donor vs Admin */}
          <div className="bg-[var(--card-bg)] p-1.5 rounded-2xl border border-[var(--border-color)] grid grid-cols-2 gap-1 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab("donor");
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "donor"
                  ? "bg-[var(--color-primary)] text-white shadow-sm"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-alt)]"
              }`}
            >
              <User className="w-4 h-4" />
              <span>রক্তদাতা লগইন</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("admin");
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "admin"
                  ? "bg-stone-800 dark:bg-stone-700 text-white shadow-sm"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-alt)]"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>অ্যাডমিন লগইন</span>
            </button>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 shadow-xl">
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-red-700 dark:text-red-300 text-xs sm:text-sm animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Identifier Input */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                  {activeTab === "donor" ? "মোবাইল নম্বর বা ইমেইল" : "অ্যাডমিন মোবাইল বা ইমেইল"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                    {identifier.includes("@") ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <Phone className="w-4 h-4" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      activeTab === "donor"
                        ? "০১৭xxxxxxxx বা ইমেইল"
                        : "admin@fulpurblood.org বা মোবাইল"
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                    পাসওয়ার্ড
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--foreground-subtle)] hover:text-[var(--foreground)]"
                    aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>প্রবেশ করুন</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Hint */}
            <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--foreground-subtle)]">
              {activeTab === "donor" ? (
                <span>ডেমো ডোনার লগইন: 01712345678 / password123</span>
              ) : (
                <span>অ্যাডমিন পোর্টাল শুধু অনুমোদিত কর্মকর্তাদের জন্য সংরক্ষিত</span>
              )}
            </div>
          </div>

          {/* Registration Prompt Link */}
          <div className="text-center">
            <p className="text-sm text-[var(--foreground-muted)]">
              এখনও রক্তদাতা হিসেবে যুক্ত হননি?{" "}
              <Link
                href="/register"
                className="font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
              >
                <span>নতুন রক্তদাতা নিবন্ধন করুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
