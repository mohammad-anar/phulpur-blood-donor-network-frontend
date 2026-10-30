"use client";

import { motion } from "framer-motion";
import {
  Droplet,
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  Share2,
  Award,
  Users,
  Plus,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DonorTab } from "../DonorSidebar";
import { defaultDonorDonations, DonationRecord } from "@/lib/data/donorDonations";
import {
  useDonorCountdown,
  toBengaliNumber,
  formatBengaliDate,
  formatBloodGroup,
} from "@/lib/utils/donorCountdown";
import { useAuth } from "@/lib/api/useAuth";
import { useToast } from "@/components/common/Toast";
import {
  useGetMyDonationsQuery,
  useGetEmergencyRequestsQuery,
} from "@/lib/store/api/bloodDonationApi";

interface DonorDashboardTabProps {
  onNavigateTab?: (tab: DonorTab) => void;
  donations?: DonationRecord[];
}

export function DonorDashboardTab({
  onNavigateTab,
}: DonorDashboardTabProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { success } = useToast();

  const handleNavigate = (tab: DonorTab) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      router.push(tab === "dashboard" ? "/donor" : `/donor/${tab}`);
    }
  };

  // 1. Fetch real donation records & stats for the logged-in donor
  const { data: myDonationsData } = useGetMyDonationsQuery();
  const activeDonations: DonationRecord[] = myDonationsData?.donations || [];

  // 2. Fetch live emergency blood requests
  const { data: emergencyRequests } = useGetEmergencyRequestsQuery({
    bloodGroup: user?.bloodGroup || undefined,
  });

  // Live countdown using 120-day interval rule from latest approved donation record
  const countdown = useDonorCountdown(activeDonations);

  const donorName = user?.name || "রক্তদাতা";
  const donorBloodGroup = formatBloodGroup(user?.bloodGroup);
  const donorZone =
    user?.presentAddress || user?.currentAddress || user?.location || "";

  const approvedDonationsCount =
    myDonationsData?.summary?.approvedDonations ??
    activeDonations.filter((d) => d.statusType === "approved").length;

  // Badge tier calculation
  const getBadgeDetails = (count: number) => {
    if (count >= 10) {
      return {
        title: "স্বর্ণ ডোনার সম্মাননা ব্যাজ",
        desc: "ফুলপুর ব্লাড ডোনার নেটওয়ার্কে ১০+ সফল রক্তদানের অনন্য স্বীকৃতি অর্জন করেছেন।",
        level: "স্বর্ণ",
        color: "from-amber-50",
      };
    }
    if (count >= 5) {
      return {
        title: "রৌপ্য ডোনার সম্মাননা ব্যাজ",
        desc: "ফুলপুর ব্লাড ডোনার নেটওয়ার্কে ৫+ সফল রক্তদানের অনন্য স্বীকৃতি অর্জন করেছেন।",
        level: "রৌপ্য",
        color: "from-rose-50",
      };
    }
    return {
      title: "ব্রোঞ্জ ডোনার সম্মাননা ব্যাজ",
      desc: "ফুলপুর ব্লাড ডোনার নেটওয়ার্কে নিয়মিত স্বেচ্ছাসেবী রক্তদানের অনন্য স্বীকৃতি।",
      level: "ব্রোঞ্জ",
      color: "from-stone-50",
    };
  };

  const badge = getBadgeDetails(approvedDonationsCount);

  // Handle Share Badge
  const handleShareBadge = async () => {
    const text = `আমি ফুলপুর ব্লাড ডোনার নেটওয়ার্কের একজন গর্বিত স্বেচ্ছাসেবী রক্তদাতা (${donorBloodGroup})। এ পর্যন্ত আমি ${toBengaliNumber(approvedDonationsCount)} বার রক্তদান সম্পন্ন করেছি। আপনিও জরুরি মুহূর্তে জীবন বাঁচাতে রক্তদানে এগিয়ে আসুন!`;
    try {
      await navigator.clipboard.writeText(text);
      success("ব্যাজ ও স্বীকৃতির বিবরণ ক্লিপবোর্ডে কপি করা হয়েছে!", "সফল");
    } catch {
      success("ব্যাজ বিবরণ কপি করা হয়েছে!");
    }
  };

  // Handle Share Emergency Request
  const handleShareEmergency = async (req: any) => {
    const text = `জরুরি রক্তের প্রয়োজন!\nরোগী: ${req.rugirNam}\nরক্তের গ্রুপ: ${req.bloodGroup} (${req.kotoBag} ব্যাগ)\nস্থান: ${req.thikana}\nযোগাযোগ: ${req.phone}\n— ফুলপুর ব্লাড ডোনার নেটওয়ার্ক`;
    try {
      await navigator.clipboard.writeText(text);
      success("জরুরি রক্তের তথ্যাদি ক্লিপবোর্ডে কপি করা হয়েছে!", "শেয়ার সম্পন্ন");
    } catch {
      success("অনুরোধ কপি করা হয়েছে!");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 shadow-xs"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold shadow-xs">
                <Droplet className="w-3.5 h-3.5 fill-current" />
                <span>{donorBloodGroup ? `${donorBloodGroup} রক্তদাতা` : "রক্তদাতা"}</span>
              </span>
              {donorZone && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-ping" />
                  <span>{donorZone}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
              স্বাগতম, {donorName}!
            </h1>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
              আপনার প্রোফাইল, রক্তদানের ইতিহাস এবং পরবর্তী সম্ভাব্য রক্তদানের তারিখ এখান থেকে
              পরিচালনা করুন। আপনার প্রতিটি ফোঁটা রক্তে বাঁচে ফুলপুরের একটি করে অমূল্য জীবন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleNavigate("profile")}
              className="px-4 py-2.5 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all text-xs cursor-pointer shadow-xs"
            >
              প্রোফাইল দেখুন
            </button>
            <button
              onClick={() => handleNavigate("new-record")}
              className="px-4 py-2.5 rounded-xl font-bold text-[var(--color-primary)] bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-tint)] transition-all text-xs cursor-pointer border border-[var(--color-primary-border)]"
            >
              + রক্তদানের রেকর্ড যোগ করুন
            </button>
            <a
              href="tel:01972606255"
              className="px-4 py-2.5 rounded-xl font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-all text-xs cursor-pointer border border-emerald-200 dark:border-emerald-800"
            >
              জরুরি হটলাইন
            </a>
          </div>
        </div>
      </motion.div>

      {/* 2. Featured Countdown Card (পরবর্তী সম্ভাব্য রক্তদানের সময়) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] overflow-hidden shadow-xs"
      >
        <div className="p-6 sm:p-7 bg-gradient-to-r from-[var(--color-primary-light)] via-[var(--card-bg)] to-[var(--card-bg)] border-b border-[var(--border-subtle)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0 border border-[var(--color-primary-border)]">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">
                  পরবর্তী সম্ভাব্য রক্তদানের সময়
                </h2>
                <p className="text-xs text-[var(--foreground-muted)]">
                  নিয়মিত ১২০ দিনের বিরতির সাধারণ ট্র্যাকার
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/50 text-[var(--color-primary)] text-xs font-bold">
                {countdown.status === "running"
                  ? `আর ${toBengaliNumber(countdown.days)} দিন বাকি`
                  : countdown.status === "passed"
                  ? "নির্ধারিত সময়সীমা পূর্ণ"
                  : countdown.status === "no_approved"
                  ? "রেকর্ড প্রয়োজন"
                  : "বিরতি ট্র্যাকার"}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 text-xs font-semibold">
                {countdown.status === "passed"
                  ? "রক্তদানের জন্য প্রস্তুত"
                  : countdown.status === "running"
                  ? "নির্ধারিত সময়সীমা পূর্ণ প্রায়"
                  : "নিয়মিত রক্তদাতা ট্র্যাকার"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Real-time Countdown Timer / Status Units */}
          <div className="lg:col-span-5 flex flex-col justify-center p-5 sm:p-6 bg-[var(--background-alt)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
            {countdown.status === "running" && (
              <div className="w-full space-y-4">
                {/* Header status bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)]">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span>পরবর্তী রক্তদান পর্যন্ত বাকি সময়</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-[var(--color-primary)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-ping" />
                    লাইভ ট্র্যাকার
                  </span>
                </div>

                {/* 4 Responsive Countdown Blocks: দিন, ঘণ্টা, মিনিট, সেকেন্ড with subtle colon separators */}
                <div className="flex items-center justify-between gap-1 sm:gap-2">
                  {/* দিন Unit */}
                  <div className="flex-1 flex flex-col items-center justify-center py-3.5 sm:py-4 px-1 rounded-xl bg-white dark:bg-stone-900 border border-rose-200/80 dark:border-rose-950 shadow-xs relative overflow-hidden group hover:border-[var(--color-primary)] transition-all">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-rose-700" />
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-primary)] leading-tight tabular-nums">
                      {toBengaliNumber(String(countdown.days).padStart(2, "0"))}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider mt-1">
                      দিন
                    </span>
                  </div>

                  <span className="text-lg sm:text-xl font-bold text-rose-300 dark:text-rose-800 select-none pb-4">
                    :
                  </span>

                  {/* ঘণ্টা Unit */}
                  <div className="flex-1 flex flex-col items-center justify-center py-3.5 sm:py-4 px-1 rounded-xl bg-white dark:bg-stone-900 border border-rose-200/80 dark:border-rose-950 shadow-xs relative overflow-hidden group hover:border-[var(--color-primary)] transition-all">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-rose-700" />
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-primary)] leading-tight tabular-nums">
                      {toBengaliNumber(String(countdown.hours).padStart(2, "0"))}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider mt-1">
                      ঘণ্টা
                    </span>
                  </div>

                  <span className="text-lg sm:text-xl font-bold text-rose-300 dark:text-rose-800 select-none pb-4">
                    :
                  </span>

                  {/* মিনিট Unit */}
                  <div className="flex-1 flex flex-col items-center justify-center py-3.5 sm:py-4 px-1 rounded-xl bg-white dark:bg-stone-900 border border-rose-200/80 dark:border-rose-950 shadow-xs relative overflow-hidden group hover:border-[var(--color-primary)] transition-all">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-rose-700" />
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-primary)] leading-tight tabular-nums">
                      {toBengaliNumber(String(countdown.minutes).padStart(2, "0"))}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider mt-1">
                      মিনিট
                    </span>
                  </div>

                  <span className="text-lg sm:text-xl font-bold text-rose-300 dark:text-rose-800 select-none pb-4">
                    :
                  </span>

                  {/* সেকেন্ড Unit */}
                  <div className="flex-1 flex flex-col items-center justify-center py-3.5 sm:py-4 px-1 rounded-xl bg-white dark:bg-stone-900 border border-rose-200/80 dark:border-rose-950 shadow-xs relative overflow-hidden group hover:border-[var(--color-primary)] transition-all">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-rose-700" />
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-primary)] leading-tight tabular-nums">
                      {toBengaliNumber(String(countdown.seconds).padStart(2, "0"))}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider mt-1">
                      সেকেন্ড
                    </span>
                  </div>
                </div>

                {/* Subtitle / formatted target date and disclaimer */}
                <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1 text-center">
                  <p className="text-xs font-semibold text-[var(--foreground)]">
                    পরবর্তী সম্ভাব্য তারিখ:{" "}
                    <span className="text-[var(--color-primary)] font-bold">
                      {formatBengaliDate(countdown.targetDate)}
                    </span>
                  </p>
                  <p className="text-[10px] text-[var(--foreground-subtle)] leading-relaxed">
                    * ১২০ দিনের বিরতি ট্র্যাকারটি সাধারণ সময়ভিত্তিক অনুস্মারক মাত্র; এটি রক্তদানের চূড়ান্ত শারীরিক বা চিকিৎসা ছাড়পত্র নয়।
                  </p>
                </div>
              </div>
            )}

            {countdown.status === "passed" && (
              <div className="w-full text-center py-3 px-2 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
                    নির্ধারিত সময়সীমা পূর্ণ
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] mt-1 max-w-xs mx-auto leading-relaxed">
                    আপনার সর্বশেষ রক্তদানের ১২০ দিনের নির্ধারিত বিরতি পূর্ণ হয়েছে। আপনি শারীরিক সুস্থতা সাপেক্ষে পুনরায় রক্তদানের জন্য প্রস্তুত।
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => handleNavigate("new-record")}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                  >
                    + নতুন রক্তদান যোগ করুন
                  </button>
                </div>
                <p className="text-[10px] text-[var(--foreground-subtle)] leading-relaxed pt-1">
                  * ১২০ দিনের বিরতি ট্র্যাকারটি সাধারণ সময়ভিত্তিক অনুস্মারক মাত্র; এটি রক্তদানের চূড়ান্ত শারীরিক বা চিকিৎসা ছাড়পত্র নয়।
                </p>
              </div>
            )}

            {countdown.status === "no_approved" && (
              <div className="w-full text-center py-3 px-2 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shadow-xs">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-amber-800 dark:text-amber-300">
                    সর্বশেষ অনুমোদিত রক্তদানের তারিখ যোগ করা হয়নি
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] mt-1 max-w-xs mx-auto leading-relaxed">
                    সঠিক ১২০ দিনের কাউন্টডাউন ও পরবর্তী সম্ভাব্য রক্তদানের তারিখ ট্র্যাকিংয়ের জন্য আপনার অনুমোদিত রক্তদানের তথ্য প্রয়োজন।
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => handleNavigate("new-record")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>রক্তদানের রেকর্ড যোগ করুন</span>
                  </button>
                </div>
              </div>
            )}

            {(countdown.status === "future_date" || countdown.status === "invalid_date") && (
              <div className="w-full text-center py-3 px-2 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-[var(--color-primary)] flex items-center justify-center shadow-xs">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[var(--color-primary)]">
                    {countdown.status === "future_date"
                      ? "ভবিষ্যতের রক্তদানের তারিখ গ্রহণযোগ্য নয়"
                      : "রক্তদানের তারিখটি সঠিক নয়"}
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] mt-1 max-w-xs mx-auto leading-relaxed">
                    আপনার সর্বশেষ রেকর্ডের রক্তদানের তারিখটি সঠিকভাবে যাচাই করুন। সঠিক অতীত তারিখ ব্যতিরেকে সময় ট্র্যাকিং সম্ভব নয়।
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => handleNavigate("history")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors cursor-pointer"
                  >
                    <span>ইতিহাস দেখুন ও সংশোধন করুন</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3 Metric Summary Boxes */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)]">
              <span className="text-xs text-[var(--foreground-muted)] font-medium">
                সর্বশেষ রক্তদান
              </span>
              <p className="text-base font-bold text-[var(--foreground)] mt-1">
                {countdown.latestApprovedDate ? formatBengaliDate(countdown.latestApprovedDate) : "—"}
              </p>
              <span className="text-[11px] text-[var(--foreground-subtle)]">
                {countdown.daysAgo !== null ? `${toBengaliNumber(countdown.daysAgo)} দিন পূর্বে` : "তথ্য নেই"}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--color-primary-light)] border border-[var(--color-primary-border)]">
              <span className="text-xs text-[var(--color-primary)] font-semibold">
                পরবর্তী আনুমানিক তারিখ
              </span>
              <p className="text-base font-extrabold text-[var(--color-primary)] mt-1">
                {countdown.targetDate ? formatBengaliDate(countdown.targetDate) : "—"}
              </p>
              <span className="text-[11px] text-[var(--color-primary)]/80">
                পূর্ণ সুস্থতা সাপেক্ষে
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)]">
              <span className="text-xs text-[var(--foreground-muted)] font-medium">
                অবশিষ্ট সময়
              </span>
              <p className="text-base font-bold text-[var(--foreground)] mt-1">
                {countdown.status === "running"
                  ? `${toBengaliNumber(String(countdown.days).padStart(2, "0"))} দিন`
                  : countdown.status === "passed"
                  ? "সময় পূর্ণ"
                  : "—"}
              </p>
              <span
                className={`text-[11px] font-medium ${
                  countdown.status === "passed" ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {countdown.status === "passed" ? "রক্তদানের জন্য প্রস্তুত" : "সতর্ক অবস্থায় থাকুন"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. 4-Metrics Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)] font-medium">
            আমার রক্তদানের রেকর্ড
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-[var(--color-primary)]">
              {toBengaliNumber(String(approvedDonationsCount).padStart(2, "0"))}
            </span>
            <span className="text-xs font-semibold text-[var(--foreground-muted)]">
              বার
            </span>
          </div>
          <span className="text-[11px] text-[var(--foreground-subtle)] mt-1 block">
            {toBengaliNumber(approvedDonationsCount * 3)}টি জীবন রক্ষায় সহায়তা
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)] font-medium">
            সর্বশেষ রক্তদানের স্থান
          </span>
          <p className="text-sm font-bold text-[var(--foreground)] mt-1">
            {countdown.latestApprovedDate ? formatBengaliDate(countdown.latestApprovedDate) : "—"}
          </p>
          <span className="text-[11px] text-[var(--foreground-subtle)] truncate block">
            {countdown.latestRecord?.hospital || "তথ্য নেই"}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)] font-medium">
            পরবর্তী রক্তদান প্রস্তুতি
          </span>
          <p className="text-sm font-bold text-[var(--color-primary)] mt-1">
            {countdown.targetDate ? formatBengaliDate(countdown.targetDate) : "—"}
          </p>
          <span className="text-[11px] text-[var(--foreground-subtle)] block">
            {countdown.status === "passed" ? "এখনই রক্তদানে প্রস্তুত" : "প্রস্তুত হওয়ার পরামর্শ"}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
          <span className="text-xs text-[var(--foreground-muted)] font-medium">
            প্রোফাইলের অবস্থা
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                countdown.status === "passed" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span className="text-sm font-bold text-[var(--foreground)]">
              {countdown.status === "passed" ? "রক্তদানে প্রস্তুত" : "সক্রিয় সদস্য"}
            </span>
          </div>
          <span className="text-[11px] text-[var(--foreground-subtle)] block">
            পাবলিকলি দৃশ্যমান
          </span>
        </div>
      </div>

      {/* 4. Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent History & Badges */}
        <div className="lg:col-span-7 space-y-6">
          {/* History Summary Table */}
          <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">
                  সাম্প্রতিক রক্তদানের সারাংশ ও সনদ
                </h3>
                <p className="text-xs text-[var(--foreground-muted)]">
                  আপনার অতীত রক্তদান কার্যতালিকা ও প্রাতিষ্ঠানিক ডিজিটাল স্বীকৃতি
                </p>
              </div>
              <button
                onClick={() => handleNavigate("history")}
                className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>সকল ইতিহাস</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[var(--background-alt)] text-[var(--foreground-muted)]">
                  <tr>
                    <th className="p-3 rounded-l-lg">তারিখ</th>
                    <th className="p-3">স্থান ও হাসপাতাল</th>
                    <th className="p-3">রোগীর ধরণ / ইউনিট</th>
                    <th className="p-3 rounded-r-lg text-right">স্থিতি</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {activeDonations.length > 0 ? (
                    activeDonations.slice(0, 3).map((donation) => (
                      <tr key={donation.id}>
                        <td className="p-3 font-semibold text-[var(--foreground)]">
                          {donation.date}
                        </td>
                        <td className="p-3 text-[var(--foreground-muted)]">
                          {donation.hospital}
                        </td>
                        <td className="p-3 text-[var(--foreground-muted)]">
                          {donation.caseNote}
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              donation.statusType === "approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : donation.statusType === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {donation.statusType === "approved" ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            <span>{donation.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-xs text-[var(--foreground-muted)]">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Clock className="w-7 h-7 text-[var(--foreground-subtle)]" />
                          <p className="font-semibold text-sm text-[var(--foreground)]">এখনও কোনো রক্তদানের রেকর্ড যোগ করা হয়নি</p>
                          <p className="text-xs text-[var(--foreground-muted)]">আপনার অতীত বা সাম্প্রতিক রক্তদানের তথ্য যোগ করে ইতিহাস সংরক্ষণ করুন।</p>
                          <button
                            onClick={() => handleNavigate("new-record")}
                            className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>নতুন রেকর্ড যোগ করুন</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Honor Badge Card */}
          <div className={`p-5 rounded-2xl bg-gradient-to-r ${badge.color} via-[var(--card-bg)] to-[var(--card-bg)] border border-[var(--color-primary-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs`}>
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--foreground)]">
                  {badge.title}
                </h4>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {badge.desc}
                </p>
              </div>
            </div>
            <button
              onClick={handleShareBadge}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              ব্যাজ শেয়ার করুন
            </button>
          </div>
        </div>

        {/* Right Column: Live Emergency Feed & Forum */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emergency Blood Requests */}
          <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <h3 className="text-base font-bold text-[var(--foreground)]">
                  জরুরি রক্তের প্রয়োজন
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                {donorBloodGroup} উপযোগী
              </span>
            </div>

            {emergencyRequests && emergencyRequests.length > 0 ? (
              emergencyRequests.slice(0, 2).map((req, idx) => (
                <div
                  key={req.id || idx}
                  className={`p-4 rounded-xl border-l-4 space-y-2.5 ${
                    idx === 0
                      ? "bg-red-50/70 dark:bg-red-950/20 border-red-600"
                      : "bg-[var(--background-alt)] border-amber-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-700 dark:text-red-400">
                      {req.title || "জরুরি রক্তের অনুরোধ"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold">
                      {formatBloodGroup(req.bloodGroup)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--foreground)]">
                    রোগী: {req.rugirNam}
                  </h4>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {req.thikana}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-red-700 dark:text-red-300">
                      প্রয়োজন: {toBengaliNumber(req.kotoBag)} ব্যাগ
                    </span>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${req.phone}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        <Phone className="w-3 h-3" />
                        <span>যোগাযোগ</span>
                      </a>
                      <button
                        onClick={() => handleShareEmergency(req)}
                        className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:bg-[var(--card-bg)] transition-colors cursor-pointer"
                        title="অনুরোধ শেয়ার করুন"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[var(--foreground-muted)] py-4 text-center">
                এই মুহূর্তে কোনো জরুরি রক্তের অনুরোধ নেই।
              </p>
            )}
          </div>

          {/* Blood Friend Forum */}
          <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--foreground)]">
                  ফুলপুর রক্তবন্ধু ফোরাম
                </h4>
                <p className="text-[11px] text-[var(--foreground-muted)]">
                  ১০টি ইউনিয়নের ২০০+ নিয়মিত রক্তদাতার সাথে যুক্ত থাকুন
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                success("রক্তবন্ধু ফোরাম কমিউনিটি গ্রুপে আপনাকে স্বাগত জানানো হচ্ছে!");
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors whitespace-nowrap cursor-pointer"
            >
              গ্রুপে যুক্ত হন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
