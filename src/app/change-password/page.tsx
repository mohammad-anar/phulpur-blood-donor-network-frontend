"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { authApi, ApiError, getStoredToken } from "@/lib/api/auth";
import { useToast } from "@/components/common/Toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { success, error, warning } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailRequiredNotice, setEmailRequiredNotice] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.push("/login?redirect=/change-password");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setEmailRequiredNotice(false);

    if (!currentPassword) {
      setErrorMessage("বর্তমান পাসওয়ার্ড লিখুন");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("নতুন পাসওয়ার্ড দুটি মিলছে না");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });

      setIsSuccess(true);
      success("পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!", "নিরাপত্তা আপডেট");
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.errorCode === "EMAIL_REQUIRED") {
          // Exact required prompt toast: You must update your email
          error("You must update your email", "Email Required");
          setEmailRequiredNotice(true);
          setErrorMessage("পাসওয়ার্ড পরিবর্তনের পূর্বে আপনার প্রোফাইলে একটি সচল ইমেইল যুক্ত করা বাধ্যতামূলক।");
        } else if (err.errorCode === "EMAIL_NOT_VERIFIED") {
          warning("পাসওয়ার্ড পরিবর্তন করতে অনুগ্রহ করে প্রথমে আপনার ইমেইল যাচাই (Verify) করুন।", "ইমেইল অযাচাইকৃত");
          setErrorMessage("আপনার ইমেইলটি এখনো ভেরিফাই করা হয়নি। ভেরিফিকেশন লিংক পাঠানোর পর চেক করুন।");
        } else {
          setErrorMessage(err.message);
          error(err.message, "পাসওয়ার্ড পরিবর্তন ব্যর্থ");
        }
      } else {
        const msg = err?.message || "পাসওয়ার্ড পরিবর্তন করা সম্ভব হয়নি।";
        setErrorMessage(msg);
        error(msg, "পাসওয়ার্ড পরিবর্তন ব্যর্থ");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full space-y-6 relative z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
              পাসওয়ার্ড পরিবর্তন
            </h1>
            <p className="text-sm text-[var(--foreground-muted)] max-w-sm mx-auto">
              আপনার অ্যাকাউন্টের সুরক্ষায় নিয়মিত শক্তিশালী পাসওয়ার্ড ব্যবহার করুন
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
                    পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
                    আপনার অ্যাকাউন্টের পাসওয়ার্ড সুরক্ষিতভাবে আপডেট করা হয়েছে।
                  </p>
                </div>
                <Link
                  href="/donor"
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all shadow-md inline-flex items-center justify-center gap-2"
                >
                  <span>প্রোফাইলে ফিরে যান</span>
                </Link>
              </div>
            ) : (
              <>
                {emailRequiredNotice && (
                  <div className="mb-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs sm:text-sm space-y-2.5">
                    <div className="flex items-start gap-2.5 font-bold">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <span>ইমেইল আপডেট বাধ্যতামূলক</span>
                    </div>
                    <p className="leading-relaxed text-[11px] sm:text-xs">
                      নিরাপত্তার স্বার্থে পাসওয়ার্ড পরিবর্তনের পূর্বে অ্যাকাউন্টে একটি সচল ইমেইল ঠিকানা যুক্ত থাকা আবশ্যক।
                    </p>
                    <Link
                      href="/donor"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>প্রোফাইলে ইমেইল যোগ করুন</span>
                    </Link>
                  </div>
                )}

                {errorMessage && !emailRequiredNotice && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-red-700 dark:text-red-300 text-xs sm:text-sm animate-in fade-in duration-200">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                    <div className="flex-1 font-medium">{errorMessage}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                      বর্তমান পাসওয়ার্ড
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="আপনার বর্তমান পাসওয়ার্ড"
                        required
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                        autoComplete="current-password"
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
                        placeholder="কমপক্ষে ৬ অক্ষর"
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

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-[var(--foreground)]">
                      নতুন পাসওয়ার্ড পুনরায় লিখুন
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--foreground-subtle)]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="নতুন পাসওয়ার্ড নিশ্চিত করুন"
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
                        <ShieldCheck className="w-4 h-4" />
                        <span>পাসওয়ার্ড পরিবর্তন করুন</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] text-center">
              <Link
                href="/donor"
                className="inline-flex items-center gap-2 text-xs font-bold text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>প্রোফাইলে ফিরে যান</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
