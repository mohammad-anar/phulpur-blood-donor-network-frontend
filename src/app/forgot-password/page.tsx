"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Send,
  HelpCircle,
} from "lucide-react";
import { authApi, ApiError } from "@/lib/api/auth";
import { useToast } from "@/components/common/Toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ForgotPasswordPage() {
  const { success, error } = useToast();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setErrorMessage("অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা লিখুন");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgotPassword(trimmed);
      setIsSubmitted(true);
      success(
        "যদি এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট থেকে থাকে, তবে পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।",
        "অনুরোধ সফল"
      );
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
        error(err.message, "অনুরোধ ব্যর্থ");
      } else {
        const msg = err?.message || "পাসওয়ার্ড রিসেট লিংক পাঠানো সম্ভব হয়নি।";
        setErrorMessage(msg);
        error(msg, "অনুরোধ ব্যর্থ");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full space-y-6 relative z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] shadow-sm">
              <KeyRound className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
              পাসওয়ার্ড পুনরুদ্ধার
            </h1>
            <p className="text-sm text-[var(--foreground-muted)] max-w-sm mx-auto">
              আপনার অ্যাকাউন্টে নিবন্ধিত ইমেইল ঠিকানা প্রদান করুন, আমরা একটি সুরক্ষিত রিসেট লিংক পাঠাব
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 shadow-xl">
            {isSubmitted ? (
              <div className="space-y-5 text-center py-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[var(--foreground)]">
                    ইমেইল যাচাই করুন
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
                    যদি <strong>{email}</strong> ঠিকানায় কোনো অ্যাকাউন্ট নিবন্ধিত থাকে, তবে পাসওয়ার্ড রিসেটের নির্দেশনাসহ একটি ইমেইল পাঠানো হয়েছে। ইনবক্স অথবা স্প্যাম (Spam) ফোল্ডার পরীক্ষা করুন।
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <Link
                    href="/login"
                    className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all shadow-sm text-center"
                  >
                    লগইন পেজে ফিরে যান
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    className="text-xs font-semibold text-[var(--foreground-muted)] hover:text-[var(--foreground)] py-1.5"
                  >
                    অন্য ইমেইল দিয়ে চেষ্টা করুন
                  </button>
                </div>
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
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                      নিবন্ধিত ইমেইল ঠিকানা
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
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
                        <Send className="w-4 h-4" />
                        <span>রিসেট লিংক পাঠান</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-5 p-3.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] flex items-start gap-2.5 text-xs text-[var(--foreground-muted)]">
                  <HelpCircle className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                  <div>
                    যদি আপনার অ্যাকাউন্টে ইমেইল যুক্ত না থাকে, তবে পাসওয়ার্ড পরিবর্তনের জন্য ফুলপুর ব্লাড ডোনার নেটওয়ার্কের অ্যাডমিনের সাথে যোগাযোগ করুন।
                  </div>
                </div>
              </>
            )}

            <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>লগইন পেজে ফিরে যান</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
