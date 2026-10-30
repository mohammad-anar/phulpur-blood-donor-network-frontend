"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Lock,
  History as HistoryIcon,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { DonorTab } from "../DonorSidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/api/useAuth";
import { useToast } from "@/components/common/Toast";
import {
  useCreateDonationMutation,
  useGetMyDonationsQuery,
} from "@/lib/store/api/bloodDonationApi";
import {
  formatBengaliDate,
  formatBloodGroup,
  toBengaliNumber,
} from "@/lib/utils/donorCountdown";

interface DonorNewRecordTabProps {
  onNavigateTab?: (tab: DonorTab) => void;
}

export function DonorNewRecordTab({ onNavigateTab }: DonorNewRecordTabProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleNavigate = (tab: DonorTab) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      router.push(tab === "dashboard" ? "/donor" : `/donor/${tab}`);
    }
  };

  const { success, error } = useToast();
  const [createDonation, { isLoading: isSubmitting }] = useCreateDonationMutation();
  const { data: myDonationsData, isLoading: isLoadingDonations } = useGetMyDonationsQuery();

  const [todayStr, setTodayStr] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [clientNowMs, setClientNowMs] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setTodayStr(today);
    setDate((prev) => prev || today);
    setClientNowMs(Date.now());
  }, []);

  const [hospital, setHospital] = useState("ফুলপুর উপজেলা স্বাস্থ্য কমপ্লেক্স");
  const [district, setDistrict] = useState("ময়মনসিংহ");
  const [upazila, setUpazila] = useState("ফুলপুর");
  const [confirmedOath, setConfirmedOath] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const donorBloodGroup = formatBloodGroup(user?.bloodGroup) || "O+";
  const donorIdShort = user?.id ? user.id.slice(-4).toUpperCase() : "8842";

  // Calculate 120-day cooldown status based on previous donations
  const submissionCooldown = myDonationsData?.submissionCooldown;
  const activeDonations = (myDonationsData?.donations || []).filter(
    (d) => d.statusType !== "rejected"
  );
  const latestDonation = [...activeDonations].sort(
    (a, b) => new Date(b.isoDate || b.date).getTime() - new Date(a.isoDate || a.date).getTime()
  )[0];

  const lastDonationDateStr =
    submissionCooldown?.lastDonationDate ||
    latestDonation?.isoDate ||
    myDonationsData?.countdown?.lastDonationDate;

  const lastDonationDateObj = lastDonationDateStr ? new Date(lastDonationDateStr) : null;

  let isCoolingDown = false;
  let daysRemaining = 0;
  let daysSinceLast = 0;

  if (clientNowMs && lastDonationDateObj && !isNaN(lastDonationDateObj.getTime())) {
    const msSince = clientNowMs - lastDonationDateObj.getTime();
    daysSinceLast = Math.max(0, Math.floor(msSince / (1000 * 60 * 60 * 24)));
    if (daysSinceLast < 120) {
      isCoolingDown = true;
      daysRemaining = 120 - daysSinceLast;
    }
  } else if (submissionCooldown && !submissionCooldown.canSubmitNewRecord) {
    isCoolingDown = true;
    daysRemaining = submissionCooldown.daysRemaining;
  }

  const nextEligibleDateObj = lastDonationDateObj
    ? new Date(lastDonationDateObj.getTime() + 120 * 24 * 60 * 60 * 1000)
    : null;
  const nextEligibleDateStr = nextEligibleDateObj
    ? nextEligibleDateObj.toISOString().split("T")[0]
    : undefined;

  const latestRecordStatus =
    latestDonation?.status ||
    (submissionCooldown?.lastStatus === "PENDING"
      ? "যাচাই প্রক্রিয়াধীন"
      : submissionCooldown?.lastStatus === "APPROVED"
      ? "অনুমোদিত"
      : "রেকর্ড সংরক্ষিত");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 120-day interval safeguard
    if (isCoolingDown) {
      const msg = `পূর্ববর্তী রক্তদানের ১২০ দিন পূর্ণ হওয়ার পূর্বে নতুন রেকর্ড জমা দেওয়া সম্ভব নয়। আরও ${toBengaliNumber(daysRemaining)} দিন বাকি আছে।`;
      setErrorMessage(msg);
      error(msg, "অনুরোধ বাতিল");
      return;
    }

    if (!confirmedOath) {
      error("অনুগ্রহ করে শপথ বক্সে টিক চিহ্ন প্রদান করুন");
      return;
    }

    const selectedDate = new Date(date);
    const now = new Date();
    if (selectedDate.getTime() > now.getTime()) {
      const msg = "ভবিষ্যতের রক্তদানের তারিখ গ্রহণযোগ্য নয়";
      setErrorMessage(msg);
      error(msg);
      return;
    }

    // Verify date is at least 120 days after previous donation
    if (lastDonationDateObj && !isNaN(lastDonationDateObj.getTime())) {
      const diffMs = selectedDate.getTime() - lastDonationDateObj.getTime();
      const daysDiff = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (daysDiff < 120) {
        const msg = `নতুন রক্তদানের তারিখটি পূর্ববর্তী রক্তদানের (${formatBengaliDate(lastDonationDateObj)}) কমপক্ষে ১২০ দিন পরের হতে হবে।`;
        setErrorMessage(msg);
        error(msg, "তারিখ সঠিক নয়");
        return;
      }
    }

    const fullAddress = `${hospital}, ${upazila}, ${district}`;

    try {
      await createDonation({
        donationDate: date,
        donationAddress: fullAddress,
      }).unwrap();

      setSubmitted(true);
      success("রক্তদানের তথ্য সফলভাবে জমা দেওয়া হয়েছে!", "রেকর্ড সংরক্ষিত");
      setTimeout(() => {
        handleNavigate("history");
      }, 1500);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "রেকর্ড জমা দিতে সমস্যা হয়েছে।";
      setErrorMessage(msg);
      error(msg, "ব্যর্থ");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            নতুন রক্তদানের রেকর্ড
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            আপনার সাম্প্রতিক রক্তদানের তথ্য জমা দিন।
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isCoolingDown ? (
            <div className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 text-xs font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>বিরতি বাকি: {toBengaliNumber(daysRemaining)} দিন</span>
            </div>
          ) : (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>নিবন্ধন স্থিতি: সক্রিয় রক্তদাতা #{donorIdShort}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Box */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 shadow-xs">
        {isLoadingDonations ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-center">
            <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
            <span className="text-xs font-semibold text-[var(--foreground-muted)]">
              পূর্ববর্তী রেকর্ড যাচাই করা হচ্ছে...
            </span>
          </div>
        ) : submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              রেকর্ড সফলভাবে জমা দেওয়া হয়েছে!
            </h2>
            <p className="text-sm text-[var(--foreground-muted)] max-w-md mx-auto">
              আপনার রক্তদানের তথ্যটি অ্যাডমিন প্যানেলে পাঠানো হয়েছে। যাচাই সম্পন্ন হলে রক্তদানের ইতিহাসে যুক্ত হবে।
            </p>
          </div>
        ) : isCoolingDown ? (
          /* Locked 120-day interval card */
          <div className="py-6 space-y-6">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-300">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">
                  রক্তদানের ১২০ দিনের বিরতি চলমান (ফরম সাবমিশন বন্ধ)
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-300/80 mt-0.5 leading-relaxed">
                  রক্তদাতার শারীরিক সুরক্ষায় পূর্ববর্তী রক্তদানের ১২০ দিন অতিবাহিত না হওয়া পর্যন্ত নতুন তথ্য জমা সাময়িকভাবে স্থগিত রয়েছে।
                </p>
              </div>
            </div>

            {/* Countdown Highlight Card */}
            <div className="rounded-2xl border border-[var(--color-primary-border)] bg-gradient-to-br from-rose-50/60 via-[var(--card-bg)] to-amber-50/40 dark:from-rose-950/20 dark:via-[var(--card-bg)] dark:to-amber-950/10 p-6 text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold shadow-xs">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>কাউন্টডাউন বিরতি চলছে</span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-[var(--foreground-muted)] block">
                  পরবর্তী রক্তদান ও নতুন রেকর্ড জমা দেওয়ার জন্য বাকি
                </span>
                <div className="text-4xl sm:text-5xl font-black text-[var(--color-primary)] tracking-tight">
                  {toBengaliNumber(daysRemaining)}{" "}
                  <span className="text-2xl font-bold text-[var(--foreground)]">দিন</span>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-lg mx-auto text-left">
                <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] font-semibold text-[var(--foreground-muted)] block">
                    পূর্ববর্তী রক্তদানের তারিখ
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[var(--foreground)] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                    {lastDonationDateObj ? formatBengaliDate(lastDonationDateObj) : "—"}
                  </span>
                  <span className="text-[10px] inline-block px-2 py-0.5 rounded-md bg-[var(--background-alt)] text-[var(--foreground-muted)] font-medium">
                    রেকর্ড স্থিতি: {latestRecordStatus}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] font-semibold text-[var(--foreground-muted)] block">
                    পরবর্তী অনুমোদিত তারিখ
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {nextEligibleDateObj ? formatBengaliDate(nextEligibleDateObj) : "১২০ দিন পর"}
                  </span>
                  <span className="text-[10px] inline-block px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium">
                    ১২০ দিন পূর্ণ হলে আনলক হবে
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleNavigate("dashboard")}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] cursor-pointer"
              >
                ড্যাশবোর্ডে ফিরে যান
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("history")}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <HistoryIcon className="w-4 h-4" />
                <span>রক্তদানের ইতিহাস দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h2 className="text-base font-bold text-[var(--foreground)]">
                রক্তদানের বিবরণ
              </h2>
              <span className="px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold">
                গ্রুপ: {donorBloodGroup}
              </span>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
                রক্তদানের তারিখ *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  required
                  max={todayStr}
                  min={nextEligibleDateStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--background-alt)] text-xs rounded-xl border border-[var(--border-color)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                />
              </div>
            </div>

            {/* Hospital */}
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
                হাসপাতাল বা রক্তদান কেন্দ্রের নাম *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--background-alt)] text-xs rounded-xl border border-[var(--border-color)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none cursor-pointer"
                >
                  <option value="ফুলপুর উপজেলা স্বাস্থ্য কমপ্লেক্স">
                    ফুলপুর উপজেলা স্বাস্থ্য কমপ্লেক্স
                  </option>
                  <option value="ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল (MMCH)">
                    ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল (MMCH)
                  </option>
                  <option value="ফুলপুর পপুলার ডায়াগনস্টিক ক্লিনিক">
                    ফুলপুর পপুলার ডায়াগনস্টিক ক্লিনিক
                  </option>
                  <option value="তারাকান্দা উপজেলা স্বাস্থ্য কমপ্লেক্স">
                    তারাকান্দা উপজেলা স্বাস্থ্য কমপ্লেক্স
                  </option>
                  <option value="হালুয়াঘাট স্বাস্থ্য কমপ্লেক্স">
                    হালুয়াঘাট স্বাস্থ্য কমপ্লেক্স
                  </option>
                  <option value="অন্যান্য ক্লিনিক বা হাসপাতাল">অন্যান্য ক্লিনিক বা হাসপাতাল</option>
                </select>
              </div>
            </div>

            {/* District & Upazila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
                  জেলা *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--background-alt)] text-xs rounded-xl border border-[var(--border-color)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
                  উপজেলা / জোন *
                </label>
                <input
                  type="text"
                  required
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--background-alt)] text-xs rounded-xl border border-[var(--border-color)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                />
              </div>
            </div>

            {/* Oath Checkbox */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--background-alt)] border border-[var(--border-color)] cursor-pointer">
              <input
                type="checkbox"
                required
                checked={confirmedOath}
                onChange={(e) => setConfirmedOath(e.target.checked)}
                className="mt-0.5 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
              />
              <span className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                আমি শপথপূর্বক নিশ্চিত করছি যে প্রদত্ত তথ্য সত্য এবং আমি এই রক্তদান সম্পন্ন করেছি।
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleNavigate("dashboard")}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-xs transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>রেকর্ড জমা দিন</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
