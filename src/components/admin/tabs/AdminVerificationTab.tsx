"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Search,
  RefreshCw,
  Calendar,
  Building2,
  Phone,
  Eye,
  FileText,
  User,
  X,
} from "lucide-react";
import {
  useGetAdminDonationsQuery,
  AdminDonationItem,
} from "@/lib/store/api/bloodDonationApi";
import {
  toBengaliNumber,
  formatBengaliDate,
  formatBloodGroup,
} from "@/lib/utils/donorCountdown";
import { getAssetUrl } from "@/lib/api/auth";

export function AdminVerificationTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [previewSlipImage, setPreviewSlipImage] = useState<string | null>(null);

  const {
    data: donationsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAdminDonationsQuery({
    limit: 200,
  });

  const donations = donationsData?.data || [];

  // Filter donations by search query (donor name, phone, hospital, blood group)
  const filteredDonations = useMemo(() => {
    if (!searchQuery.trim()) return donations;
    const q = searchQuery.toLowerCase().trim();
    return donations.filter(
      (item) =>
        item.donor?.name?.toLowerCase().includes(q) ||
        item.donor?.phone?.includes(q) ||
        item.donor?.bloodGroup?.toLowerCase().includes(q) ||
        item.donationAddress?.toLowerCase().includes(q) ||
        (item.rugirDhoron && item.rugirDhoron.toLowerCase().includes(q))
    );
  }, [donations, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[var(--color-primary)]">
            ডোনার রেকর্ড ম্যানেজমেন্ট
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight mt-0.5">
            রক্তদানের রিপোর্ট তালিকা
          </h1>
          <p className="text-sm text-[var(--foreground-muted)]">
            স্বেচ্ছাসেবী রক্তদাতাদের জমাকৃত সকল অনুমোদিত রক্তদানের সম্পূর্ণ তালিকা ও রিপোর্ট।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--foreground)] bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--background-alt)] shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[var(--foreground-muted)] ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            <span>রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* 2. Single Stat Card: অনুমোদিত রেকর্ড */}
      <div className="max-w-md">
        <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[var(--foreground-muted)] font-semibold">
              অনুমোদিত রেকর্ড
            </span>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {toBengaliNumber(donations.length)} টি
            </p>
            <span className="text-xs text-[var(--foreground-subtle)] block mt-0.5">
              ডোনারদের সরাসরি অনুমোদিত রক্তদানের তথ্য
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Main Records Report Container */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ডোনারের নাম, রক্তের গ্রুপ, মোবাইল বা হাসপাতালের নাম দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--background-alt)] text-xs rounded-xl border border-[var(--border-color)] text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition-all"
            />
          </div>

          <div className="text-xs text-[var(--foreground-muted)] self-end sm:self-center font-medium">
            মোট প্রদর্শিত: <strong className="text-[var(--foreground)] font-bold">{toBengaliNumber(filteredDonations.length)}</strong> টি রেকর্ড
          </div>
        </div>

        {/* Content Table / List */}
        {isLoading ? (
          <div className="p-12 text-center text-[var(--foreground-muted)]">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-[var(--color-primary)]" />
            <p className="text-sm font-medium">রক্তদানের রেকর্ড তালিকা লোড হচ্ছে...</p>
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="p-12 text-center text-[var(--foreground-muted)]">
            <FileText className="w-8 h-8 mx-auto mb-2 text-[var(--foreground-subtle)]" />
            <p className="text-sm font-semibold">কোনো রক্তদানের রেকর্ড পাওয়া যায়নি।</p>
            {searchQuery && (
              <p className="text-xs text-[var(--foreground-subtle)] mt-1">
                অনুগ্রহ করে অন্য কি-ওয়ার্ড দিয়ে পুনরায় অনুসন্ধান করুন।
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--background-alt)] text-[var(--foreground-muted)] font-bold">
                  <th className="py-3.5 px-4 text-center w-12">#</th>
                  <th className="py-3.5 px-4">রক্তদাতা</th>
                  <th className="py-3.5 px-4">রক্তের গ্রুপ</th>
                  <th className="py-3.5 px-4">মোবাইল নম্বর</th>
                  <th className="py-3.5 px-4">রক্তদানের তারিখ</th>
                  <th className="py-3.5 px-4">হাসপাতাল বা রক্তদান কেন্দ্র</th>
                  <th className="py-3.5 px-4 text-center">সনদ / স্লিপ</th>
                  <th className="py-3.5 px-4 text-right">রেকর্ডের সময়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredDonations.map((item, idx) => {
                  const bloodGroupDisplay = formatBloodGroup(item.donor?.bloodGroup) || "O+";
                  const slipImage = item.slipUrl ? getAssetUrl(item.slipUrl) : null;
                  const profileImg = item.donor?.profileImage
                    ? getAssetUrl(item.donor.profileImage)
                    : "/images/donors/default.jpg";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[var(--background-alt)]/70 transition-colors"
                    >
                      {/* Index */}
                      <td className="py-3.5 px-4 text-center text-[var(--foreground-muted)] font-mono">
                        {toBengaliNumber(idx + 1)}
                      </td>

                      {/* Donor Name & Photo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[var(--border-color)] bg-[var(--background-alt)] shrink-0">
                            <Image
                              src={profileImg}
                              alt={item.donor?.name || "ডোনার"}
                              fill
                              sizes="36px"
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-[var(--foreground)] block text-sm truncate">
                              {item.donor?.name || "অজ্ঞাত রক্তদাতা"}
                            </span>
                            {item.donor?.currentAddress && (
                              <span className="text-[11px] text-[var(--foreground-muted)] block truncate max-w-[180px]">
                                {item.donor.currentAddress}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Blood Group */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-black shadow-xs">
                          {bloodGroupDisplay}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-mono font-medium">
                        <a
                          href={`tel:${item.donor?.phone}`}
                          className="inline-flex items-center gap-1.5 text-[var(--color-primary)] hover:underline font-bold"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{item.donor?.phone || "—"}</span>
                        </a>
                      </td>

                      {/* Donation Date */}
                      <td className="py-3.5 px-4 font-semibold text-[var(--foreground)]">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                          <span>{formatBengaliDate(item.donationDate)}</span>
                        </span>
                      </td>

                      {/* Center / Hospital */}
                      <td className="py-3.5 px-4 text-[var(--foreground)] max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[var(--foreground-subtle)] shrink-0" />
                          <span className="truncate">{item.donationAddress}</span>
                        </div>
                        {item.rugirDhoron && (
                          <span className="text-[11px] text-[var(--foreground-muted)] block mt-0.5 truncate">
                            নোট: {item.rugirDhoron}
                          </span>
                        )}
                      </td>

                      {/* Slip Image */}
                      <td className="py-3.5 px-4 text-center">
                        {slipImage ? (
                          <button
                            type="button"
                            onClick={() => setPreviewSlipImage(slipImage)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-[var(--color-primary)] bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-tint)] transition-colors cursor-pointer border border-[var(--color-primary-border)]"
                          >
                            <Eye className="w-3 h-3" />
                            <span>স্লিপ দেখুন</span>
                          </button>
                        ) : (
                          <span className="text-[var(--foreground-subtle)] font-mono">—</span>
                        )}
                      </td>

                      {/* Recorded Date */}
                      <td className="py-3.5 px-4 text-right text-[11px] text-[var(--foreground-muted)] font-medium">
                        {formatBengaliDate(item.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slip Image Preview Modal */}
      {previewSlipImage && (
        <div
          onClick={() => setPreviewSlipImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full max-h-[85vh] bg-[var(--card-bg)] rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-color)] flex flex-col cursor-default"
          >
            <div className="p-3.5 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--foreground)]">
                রক্তদানের স্লিপ / সনদপত্র প্রিভিউ
              </span>
              <button
                type="button"
                onClick={() => setPreviewSlipImage(null)}
                className="p-1 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-alt)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative w-full h-[60vh] bg-black">
              <Image
                src={previewSlipImage}
                alt="স্লিপ প্রিভিউ"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminVerificationTab;
