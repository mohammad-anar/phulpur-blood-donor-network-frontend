"use client";

import { useState } from "react";
import { X, Heart, CheckCircle2 } from "lucide-react";
import { useRegisterDonorMutation, Donor } from "@/lib/store/api/bloodDonationApi";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [registerDonor, { isLoading }] = useRegisterDonorMutation();

  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "O+" as Donor["bloodGroup"],
    location: "ফুলপুর, ময়মনসিংহ",
    phone: "",
    gender: "male" as "male" | "female",
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerDonor({
        name: formData.name,
        bloodGroup: formData.bloodGroup,
        location: formData.location,
        phone: formData.phone,
        gender: formData.gender,
      }).unwrap();
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch {
      // Handle error gracefully
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)] shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] transition-colors cursor-pointer"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--foreground)]">
              রেজিস্ট্রেশন সফল হয়েছে!
            </h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              ফুলপুর ব্লাড ডোনার নেটওয়ার্কে যুক্ত হওয়ার জন্য আপনাকে ধন্যবাদ। আপনার একটি রক্তদান
              বাঁচাতে পারে একটি মূল্যবান জীবন।
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 fill-current animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">
                  রক্তদাতা হিসেবে নিবন্ধন
                </h3>
                <p className="text-xs text-[var(--foreground-muted)]">
                  জীবন বাঁচাতে আপনার তথ্য দিয়ে সহযোগিতা করুন
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  আপনার নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ আরিফুল ইসলাম"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-[var(--background-alt)] text-[var(--foreground)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    রক্তের গ্রুপ *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bloodGroup: e.target.value as Donor["bloodGroup"],
                      })
                    }
                    className="w-full bg-[var(--background-alt)] text-[var(--foreground)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                      <option key={g} value={g} className="bg-[var(--card-bg)]">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="০১৭১২-xxxxxx"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-[var(--background-alt)] text-[var(--foreground)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  বর্তমান ঠিকানা / অবস্থান *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ফুলপুর বাজার, ফুলপুর, ময়মনসিংহ"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full bg-[var(--background-alt)] text-[var(--foreground)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer text-sm mt-2 disabled:opacity-50"
              >
                {isLoading ? "নিবন্ধন সম্পন্ন হচ্ছে..." : "নিবন্ধন নিশ্চিত করুন"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
