"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Send,
  Eye,
  EyeOff,
  User,
  History,
  PhoneCall,
  Globe,
  Settings,
} from "lucide-react";
import { useAuth } from "@/lib/api/useAuth";
import { authApi, ApiError } from "@/lib/api/auth";
import { useToast } from "@/components/common/Toast";

export function DonorSettingsTab() {
  const { user, refreshUser } = useAuth();
  const { success, error, warning } = useToast();

  const emailInputRef = useRef<HTMLInputElement>(null);

  // Email state
  const [email, setEmail] = useState(user?.email || "");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isSendingVerify, setIsSendingVerify] = useState(false);
  const [emailHighlight, setEmailHighlight] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Preferences
  const [allowDirectCall, setAllowDirectCall] = useState(true);
  const [showInPublicDirectory, setShowInPublicDirectory] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Handle Email Update
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!trimmed) {
      error("অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা লিখুন");
      return;
    }

    setIsUpdatingEmail(true);
    try {
      await authApi.updateEmail(trimmed);
      await refreshUser();
      setEmailHighlight(false);
      success("ইমেইল সফলভাবে আপডেট করা হয়েছে। একটি যাচাইকরণ লিংক পাঠানো হয়েছে!", "ইমেইল আপডেট");
    } catch (err: any) {
      const msg = err?.message || "ইমেইল আপডেট করতে সমস্যা হয়েছে।";
      error(msg, "ব্যর্থ");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  // Handle Send Email Verification
  const handleSendVerification = async () => {
    setIsSendingVerify(true);
    try {
      await authApi.sendEmailVerification();
      success("আপনার ইমেইলে যাচাইকরণ লিংক পাঠানো হয়েছে!", "ভেরিফিকেশন ইমেইল");
    } catch (err: any) {
      const msg = err?.message || "ভেরিফিকেশন ইমেইল পাঠানো সম্ভব হয়নি।";
      error(msg, "ব্যর্থ");
    } finally {
      setIsSendingVerify(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError("বর্তমান পাসওয়ার্ড লিখুন");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("নতুন পাসওয়ার্ড দুটি মিলছে না");
      return;
    }

    setIsChangingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      success("পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!", "নিরাপত্তা আপডেট");
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.errorCode === "EMAIL_REQUIRED") {
          error("পাসওয়ার্ড পরিবর্তনের পূর্বে ইমেইল যুক্ত করা আবশ্যক", "Email Required");
          setEmailHighlight(true);
          setPasswordError("পাসওয়ার্ড পরিবর্তনের পূর্বে আপনার প্রোফাইলে একটি সচল ইমেইল যুক্ত করা আবশ্যক।");
          emailInputRef.current?.focus();
          emailInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (err.errorCode === "EMAIL_NOT_VERIFIED") {
          warning("পাসওয়ার্ড পরিবর্তনের জন্য প্রথমে আপনার ইমেইল যাচাই (Verify) করুন।", "ইমেইল অযাচাইকৃত");
          setPasswordError("আপনার ইমেইলটি এখনো ভেরিফাই করা হয়নি। উপরে 'যাচাই লিংক পাঠান' বাটনে ক্লিক করে ইমেইল ভেরিফাই করুন।");
        } else {
          setPasswordError(err.message);
          error(err.message, "পাসওয়ার্ড পরিবর্তন ব্যর্থ");
        }
      } else {
        const msg = err?.message || "পাসওয়ার্ড পরিবর্তন করা সম্ভব হয়নি।";
        setPasswordError(msg);
        error(msg, "পাসওয়ার্ড পরিবর্তন ব্যর্থ");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    success("নিরাপত্তা ও গোপনীয়তা সেটিংস সংরক্ষিত হয়েছে!");
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const isEmailVerified = Boolean(user?.email && user?.emailVerifiedAt);

  return (
    <div className="space-y-6">
      {/* 1. Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                সেটিংস ও নিরাপত্তা
              </h1>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
                অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন, ইমেইল যাচাই এবং গোপনীয়তা নিয়ন্ত্রণ করুন
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/donor/profile"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--foreground-muted)] bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--background-alt)] transition-colors"
          >
            <User className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>প্রোফাইল সম্পাদনা</span>
          </Link>
          <Link
            href="/donor/history"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--foreground-muted)] bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--background-alt)] transition-colors"
          >
            <History className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>রক্তদানের ইতিহাস</span>
          </Link>
        </div>
      </div>

      {/* 2. Email Management Section */}
      <div
        className={`rounded-2xl bg-[var(--card-bg)] border transition-all p-6 shadow-xs space-y-4 ${
          emailHighlight
            ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary-light)]"
            : "border-[var(--card-border)]"
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-base font-bold text-[var(--foreground)]">
              ইমেইল ও নোটিফিকেশন ঠিকানা
            </h3>
          </div>
          {user?.email && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isEmailVerified
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                  : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
              }`}
            >
              {isEmailVerified ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>যাচাইকৃত (Verified)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>অযাচাইকৃত (Unverified)</span>
                </>
              )}
            </span>
          )}
        </div>

        <form onSubmit={handleUpdateEmail} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                dir="ltr"
              />
            </div>
            <button
              type="submit"
              disabled={isUpdatingEmail}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer flex-shrink-0"
            >
              {isUpdatingEmail ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>ইমেইল সংরক্ষণ করুন</span>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <p className="text-[var(--foreground-muted)]">
              পাসওয়ার্ড উদ্ধার, সিকিউরিটি নোটিফিকেশন ও অ্যাকাউন্ট সুরক্ষার জন্য ইমেইল ব্যবহৃত হয়।
            </p>

            {user?.email && !isEmailVerified && (
              <button
                type="button"
                onClick={handleSendVerification}
                disabled={isSendingVerify}
                className="inline-flex items-center gap-1 text-[var(--color-primary)] hover:underline font-bold cursor-pointer disabled:opacity-60"
              >
                {isSendingVerify ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>ভেরিফিকেশন লিংক পাঠান</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 3. Password Change & Security Section */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-[var(--foreground)]">
              পাসওয়ার্ড পরিবর্তন
            </h3>
          </div>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
          >
            পাসওয়ার্ড ভুলে গেছেন?
          </Link>
        </div>

        {passwordError && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Current Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[var(--foreground)]">
                বর্তমান পাসওয়ার্ড
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                autoComplete="current-password"
              />
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[var(--foreground)]">
                নতুন পাসওয়ার্ড
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                autoComplete="new-password"
              />
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[var(--foreground)]">
                নতুন পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="পুনরায় লিখুন"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs font-semibold text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center gap-1.5 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}</span>
            </button>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isChangingPassword ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>পাসওয়ার্ড আপডেট করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 4. Privacy Control */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
          <Globe className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-base font-bold text-[var(--foreground)]">
            নিরাপত্তা ও গোপনীয়তা নিয়ন্ত্রণ
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-[var(--foreground)]">
                  জরুরি রক্ত চাওয়ার ক্ষেত্রে সরাসরি কল পেতে সম্মত
                </h4>
              </div>
              <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                ফুলপুর উপজেলা স্বাস্থ্য কমপ্লেক্স বা ক্লিনিকে মুমূর্ষু রোগীর প্রয়োজনে সমন্বয়ক সরাসরি ফোনে যোগাযোগ করতে পারবেন।
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAllowDirectCall(!allowDirectCall);
                success("সরাসরি কল প্রাপ্যতা সেটিংস পরিবর্তিত হয়েছে");
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                allowDirectCall ? "bg-[var(--color-primary)]" : "bg-stone-300 dark:bg-stone-700"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  allowDirectCall ? "right-0.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-[var(--foreground)]">
                  পাবলিক ডিরেক্টরিতে নাম ও এলাকা প্রদর্শন
                </h4>
              </div>
              <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                ফুলপুর ব্লাড ডোনার ওয়েবের তালিকায় রক্তের গ্রুপ ও পৌরসভা/ইউনিয়নের নাম প্রকাশ করা হবে।
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowInPublicDirectory(!showInPublicDirectory);
                success("পাবলিক ডিরেক্টরি দৃশ্যমানতা সেটিংস পরিবর্তিত হয়েছে");
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                showInPublicDirectory ? "bg-[var(--color-primary)]" : "bg-stone-300 dark:bg-stone-700"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  showInPublicDirectory ? "right-0.5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>পরিবর্তন সফলভাবে সংরক্ষণ করা হয়েছে!</span>
            </span>
          )}
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={handleSavePreferences}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-xs cursor-pointer"
            >
              পরিবর্তন সংরক্ষণ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
