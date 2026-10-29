"use client";

import { useState, useEffect } from "react";
import { DonationRecord } from "../data/donorDonations";

export const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export const BENGALI_MONTHS: Record<string, number> = {
  জানুয়ারি: 0,
  জানুয়ারি: 0,
  ফেব্রুয়ারি: 1,
  ফেব্রুয়ারি: 1,
  মার্চ: 2,
  এপ্রিল: 3,
  মে: 4,
  জুন: 5,
  জুলাই: 6,
  আগস্ট: 7,
  সেপ্টেম্বর: 8,
  অক্টোবর: 9,
  নভেম্বর: 10,
  ডিসেম্বর: 11,
};

export const BENGALI_MONTH_NAMES = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

/**
 * Converts English digits to Bengali numeral strings
 */
export function toBengaliNumber(num: number | string): string {
  return String(num).replace(/[0-9]/g, (d) => BENGALI_DIGITS[parseInt(d, 10)]);
}

/**
 * Formats a Date object, ISO string, or timestamp into a readable Bengali date string (e.g., '০৩ নভেম্বর ২০২৬')
 */
export function formatBengaliDate(input: Date | string | number | null | undefined): string {
  if (!input) return "—";
  const d = input instanceof Date ? input : parseDonationDate(input);
  if (!d || isNaN(d.getTime())) return "—";
  const day = toBengaliNumber(String(d.getDate()).padStart(2, "0"));
  const month = BENGALI_MONTH_NAMES[d.getMonth()];
  const year = toBengaliNumber(d.getFullYear());
  return `${day} ${month} ${year}`;
}

/**
 * Safely parses multiple date representations:
 * - Bengali date string: '০৬ জুলাই ২০২৬'
 * - ISO string: '2026-07-06'
 * - Standard Date or numeric timestamp
 */
export function parseDonationDate(input: string | Date | number | undefined | null): Date | null {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
  if (typeof input === "number") {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }

  const str = String(input).trim();
  // Normalize Bengali digits: '২০২৬-০৭-০৬' -> '2026-07-06'
  const normalized = str.replace(/[০-৯]/g, (d) => String(BENGALI_DIGITS.indexOf(d)));

  // Try direct parse (ISO or YYYY-MM-DD or standard formats)
  const direct = new Date(normalized);
  if (!isNaN(direct.getTime()) && !/^\d{1,2}\s+[^\d]+/.test(normalized)) {
    return direct;
  }

  // Bengali text date: '06 জুলাই 2026'
  const parts = normalized.split(/[\s,/-]+/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);

    let monthIdx = -1;
    for (const [bnMonth, idx] of Object.entries(BENGALI_MONTHS)) {
      if (monthName.includes(bnMonth)) {
        monthIdx = idx;
        break;
      }
    }

    if (monthIdx !== -1 && !isNaN(day) && !isNaN(year)) {
      return new Date(year, monthIdx, day, 0, 0, 0);
    }
  }

  return null;
}

export type CountdownState =
  | "no_approved"
  | "running"
  | "passed"
  | "future_date"
  | "invalid_date";

export interface CountdownStatus {
  status: CountdownState;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  targetDate: Date | null;
  latestApprovedDate: Date | null;
  latestRecord: DonationRecord | null;
  daysAgo: number | null;
  message: string;
}

const INTERVAL_DAYS = 120;
const INTERVAL_MS = INTERVAL_DAYS * 24 * 60 * 60 * 1000;

/**
 * Calculates current countdown status based on donor records and the 120-day interval rule
 */
export function calculateCountdownStatus(
  donations: DonationRecord[] = [],
  now: Date = new Date()
): CountdownStatus {
  // Filter for approved records only (Pending records are ignored)
  const approved = donations.filter((d) => d.statusType === "approved");

  if (approved.length === 0) {
    return {
      status: "no_approved",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      targetDate: null,
      latestApprovedDate: null,
      latestRecord: null,
      daysAgo: null,
      message: "সর্বশেষ অনুমোদিত রক্তদানের তারিখ যোগ করা হয়নি",
    };
  }

  // Parse and sort approved records in descending order
  const parsedRecords = approved.map((r) => ({
    record: r,
    parsedDate: parseDonationDate(r.isoDate || r.date),
  }));

  parsedRecords.sort((a, b) => {
    if (!a.parsedDate) return 1;
    if (!b.parsedDate) return -1;
    return b.parsedDate.getTime() - a.parsedDate.getTime();
  });

  const latest = parsedRecords[0];

  if (!latest.parsedDate || isNaN(latest.parsedDate.getTime())) {
    return {
      status: "invalid_date",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      targetDate: null,
      latestApprovedDate: null,
      latestRecord: latest.record,
      daysAgo: null,
      message: "রক্তদানের তারিখটি সঠিক নয়",
    };
  }

  // Validate if date is in future
  if (latest.parsedDate.getTime() > now.getTime()) {
    return {
      status: "future_date",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      targetDate: null,
      latestApprovedDate: latest.parsedDate,
      latestRecord: latest.record,
      daysAgo: null,
      message: "ভবিষ্যতের রক্তদানের তারিখ গ্রহণযোগ্য নয়",
    };
  }

  // Calculate days passed since last donation
  const elapsedMs = now.getTime() - latest.parsedDate.getTime();
  const daysAgo = Math.floor(elapsedMs / (24 * 60 * 60 * 1000));

  // 120-day rule: Target date
  const targetDate = new Date(latest.parsedDate.getTime() + INTERVAL_MS);
  const remainingMs = targetDate.getTime() - now.getTime();

  if (remainingMs <= 0) {
    return {
      status: "passed",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      targetDate,
      latestApprovedDate: latest.parsedDate,
      latestRecord: latest.record,
      daysAgo,
      message: "নির্ধারিত সময়সীমা পূর্ণ",
    };
  }

  // Decompose remaining time into days, hours, minutes, seconds
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    status: "running",
    days,
    hours,
    minutes,
    seconds,
    targetDate,
    latestApprovedDate: latest.parsedDate,
    latestRecord: latest.record,
    daysAgo,
    message: "কাউন্টডাউন চলমান",
  };
}

const initialCountdownState: CountdownStatus = {
  status: "running",
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  targetDate: null,
  latestApprovedDate: null,
  latestRecord: null,
  daysAgo: null,
  message: "কাউন্টডাউন প্রস্তুত হচ্ছে...",
};

/**
 * Custom React hook for live 1-second countdown updates with automatic cleanup
 */
export function useDonorCountdown(donations: DonationRecord[]) {
  const [countdown, setCountdown] = useState<CountdownStatus>(initialCountdownState);

  useEffect(() => {
    // Calculated on client mount to avoid Next.js static prerender errors with new Date()
    setCountdown(calculateCountdownStatus(donations, new Date()));

    const timer = setInterval(() => {
      setCountdown(calculateCountdownStatus(donations, new Date()));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [donations]);

  return countdown;
}
