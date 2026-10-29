"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  MailCheck,
  ArrowRight,
  RefreshCw,
  Send,
  HelpCircle,
} from "lucide-react";
import { authApi, ApiError } from "@/lib/api/auth";
import { useToast } from "@/components/common/Toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const { success, error } = useToast();

  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const executeVerify = useCallback(
    async (tokenToVerify: string) => {
      setStatus("verifying");
      setErrorMessage(null);
      try {
        const res = await authApi.verifyEmail(tokenToVerify);
        setVerifiedEmail(res.email);
        setStatus("success");
        success("আপনার ইমেইল সফলভাবে যাচাই সম্পন্ন হয়েছে!", "যাচাই সফল");
      } catch (err: any) {
        setStatus("error");
        if (err instanceof ApiError) {
          setErrorMessage(err.message);
          error(err.message, "যাচাই ব্যর্থ");
        } else {
          const msg = err?.message || "টোকেনটি অবৈধ অথবা মেয়াদ উত্তীর্ণ হয়েছে।";
          setErrorMessage(msg);
          error(msg, "যাচাই ব্যর্থ");
        }
      }
    },
    [error, success]
  );

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
      executeVerify(tokenParam);
    }
  }, [searchParams, executeVerify]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setErrorMessage("অনুগ্রহ করে ভেরিফিকেশন কোড বা টোকেন লিখুন");
      return;
    }
    executeVerify(token.trim());
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authApi.sendEmailVerification();
      success("আপনার ইমেইলে নতুন ভেরিফিকেশন লিংক পাঠানো হয়েছে!", "ইমেইল পাঠানো হয়েছে");
    } catch (err: any) {
      const msg = err?.message || "ভেরিফিকেশন ইমেইল পাঠানো সম্ভব হয়নি। দয়া করে লগইন অবস্থায় চেষ্টা করুন।";
      error(msg, "ব্যর্থ");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6 relative z-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] shadow-sm">
          <MailCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          ইমেইল ভেরিফিকেশন
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] max-w-sm mx-auto">
          আপনার ফুলপুর ব্লাড ডোনার অ্যাকাউন্টের ইমেইল ঠিকানা নিশ্চিত করুন
        </p>
      </div>

      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 shadow-xl">
        {status === "verifying" && (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[var(--foreground)]">
                ইমেইল যাচাই করা হচ্ছে...
              </h3>
              <p className="text-xs text-[var(--foreground-muted)]">
                অনুগ্রহ করে অপেক্ষা করুন, সিকিউরিটি টোকেন পর্যবেক্ষণ চলছে
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="text-center space-y-5 py-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[var(--foreground)]">
                ইমেইল সফলভাবে যাচাইকৃত!
              </h3>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
                {verifiedEmail ? (
                  <>
                    <strong className="text-[var(--foreground)]">{verifiedEmail}</strong> ঠিকানাটি আপনার অ্যাকাউন্টের সাথে নিরাপদে যুক্ত হয়েছে।
                  </>
                ) : (
                  "আপনার ইমেইল সফলভাবে নিশ্চিত হয়েছে। এখন আপনার অ্যাকাউন্ট সম্পূর্ণ সুরক্ষিত।"
                )}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/donor"
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all shadow-md inline-flex items-center justify-center gap-2"
              >
                <span>ডোনার ড্যাশবোর্ডে প্রবেশ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-5 py-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[var(--foreground)]">
                ইমেইল যাচাই ব্যর্থ হয়েছে
              </h3>
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">
                {errorMessage || "টোকেনটি ভুল অথবা এর ব্যবহারের সময়সীমা শেষ হয়ে গেছে।"}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {resending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>নতুন যাচাই লিংক পাঠান</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="text-xs font-semibold text-[var(--foreground-muted)] hover:text-[var(--foreground)] py-1.5"
              >
                টোকেন ম্যানুয়ালি প্রবেশ করান
              </button>
            </div>
          </div>
        )}

        {status === "idle" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium">
                {errorMessage}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                ভেরিফিকেশন কোড / টোকেন
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ইমেইল থেকে পাওয়া টোকেন দিন"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ইমেইল যাচাই করুন</span>
            </button>

            <div className="mt-4 p-3 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] flex items-start gap-2.5 text-xs text-[var(--foreground-muted)]">
              <HelpCircle className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
              <div>
                ভেরিফিকেশন ইমেইল না পেয়ে থাকলে স্প্যাম ফোল্ডার চেক করুন অথবা ডোনার প্রোফাইল থেকে পুনরায় পাঠানোর অনুরোধ করুন।
              </div>
            </div>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] text-center">
          <Link
            href="/donor"
            className="text-xs font-bold text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            ডোনার প্রোফাইলে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
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
          <VerifyEmailContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
