"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { authApi, ApiError } from "@/lib/api/auth";
import { useToast } from "@/components/common/Toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error } = useToast();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedToken = token.trim();
    if (!trimmedToken) {
      setErrorMessage("ভ্যালিড রিসেট কোড বা টোকেন প্রদান করুন");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("পাসওয়ার্ড দুটি মিলছে না। পুনরায় নিশ্চিত করুন");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword({
        token: trimmedToken,
        newPassword,
      });

      setIsSuccess(true);
      success("পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে! নতুন পাসওয়ার্ড দিয়ে লগইন করুন।", "সফল রিসেট");
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
        error(err.message, "পাসওয়ার্ড রিসেট ব্যর্থ");
      } else {
        const msg = err?.message || "পাসওয়ার্ড রিসেট করা সম্ভব হয়নি। লিংক বা টোকেনের মেয়াদ উত্তীর্ণ হতে পারে।";
        setErrorMessage(msg);
        error(msg, "পাসওয়ার্ড রিসেট ব্যর্থ");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6 relative z-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] shadow-sm">
          <KeyRound className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          নতুন পাসওয়ার্ড তৈরি করুন
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] max-w-sm mx-auto">
          আপনার অ্যাকাউন্টের জন্য একটি শক্তিশালী নতুন পাসওয়ার্ড সেট করুন
        </p>
      </div>

      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 shadow-xl">
        {isSuccess ? (
          <div className="text-center space-y-5 py-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[var(--foreground)]">
                পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!
              </h3>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
                আপনার পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে। এখন আপনি নতুন পাসওয়ার্ড ব্যবহার করে লগইন করতে পারবেন।
              </p>
            </div>
            <Link
              href="/login"
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all shadow-md inline-flex items-center justify-center gap-2"
            >
              <span>লগইন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-red-700 dark:text-red-300 text-xs sm:text-sm animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Reset Token Input */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                  রিসেট কোড / সিকিউরিটি টোকেন
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ইমেইল থেকে পাওয়া টোকেন লিখুন"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all font-mono"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                  নতুন পাসওয়ার্ড
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--foreground-subtle)] hover:text-[var(--foreground)]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                  নতুন পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>পাসওয়ার্ড আপডেট করুন</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] text-center">
          <Link
            href="/login"
            className="text-xs font-bold text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            লগইন পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <Suspense
          fallback={
            <div className="max-w-md w-full p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] text-center">
              <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
