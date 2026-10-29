"use client";

import { X, PhoneCall, MessageSquare, MapPin, Calendar, Heart } from "lucide-react";
import Image from "next/image";
import { Donor } from "@/lib/store/api/bloodDonationApi";

interface ContactModalProps {
  isOpen: boolean;
  donor: Donor | null;
  mode: "call" | "message";
  onClose: () => void;
}

export function ContactModal({ isOpen, donor, mode, onClose }: ContactModalProps) {
  if (!isOpen || !donor) return null;

  const rawPhone = donor.phone.replace(/[^0-9]/g, "");
  // convert bengali digits to english for standard dial / SMS if needed
  const bengaliToEnglishDigits = (str: string) => {
    const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return str.replace(/[০-৯]/g, (d) => String(bn.indexOf(d)));
  };
  const dialNumber = bengaliToEnglishDigits(rawPhone);

  const defaultMessage = `আসসালামু আলাইকুম, আমি ফুলপুর ব্লাড ডোনার নেটওয়ার্ক থেকে আপনার সাথে যোগাযোগ করছি। জরুরী রক্তদানের বিষয়ে কথা বলতে চাচ্ছিলাম।`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)] shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Donor Summary */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--color-primary)]">
            <Image
              src={donor.avatarUrl || "/images/donors/default.jpg"}
              alt={donor.name}
              fill
              sizes="64px"
              unoptimized
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                {donor.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[var(--color-primary)] text-white">
                {donor.bloodGroup}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[var(--foreground-muted)] mt-1">
              <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>{donor.location}</span>
            </div>
          </div>
        </div>

        {/* Content depending on mode */}
        {mode === "call" ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[var(--background-alt)] text-center space-y-1">
              <p className="text-xs text-[var(--foreground-muted)]">ডোনারের মোবাইল নম্বর</p>
              <p className="text-xl font-bold text-[var(--color-primary)]" dir="ltr">
                {donor.phone}
              </p>
            </div>

            <a
              href={`tel:${dialNumber}`}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all shadow-md cursor-pointer text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>সরাসরি কল দিন</span>
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1">
                মেসেজ এর বিবরণ
              </label>
              <textarea
                rows={3}
                defaultValue={defaultMessage}
                className="w-full bg-[var(--background-alt)] text-[var(--foreground)] border border-[var(--border-color)] rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`sms:${dialNumber}?body=${encodeURIComponent(defaultMessage)}`}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors text-xs text-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>এসএমএস পাঠান</span>
              </a>

              <a
                href={`https://wa.me/88${dialNumber}?text=${encodeURIComponent(defaultMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-colors text-xs text-center"
              >
                <span>হোয়াটসঅ্যাপ</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
