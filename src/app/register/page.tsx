import type { Metadata } from "next";
import { RegisterContent } from "./RegisterContent";

const siteUrl = "https://phulpurblooddonornetwork.vercel.app";

export const metadata: Metadata = {
  title: "রক্তদাতা নিবন্ধন করুন | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
  description:
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্কে স্বেচ্ছায় রক্তদাতা হিসেবে বিনামূল্যে নিবন্ধন করুন। আপনার এক ব্যাগ রক্ত বাঁচাতে পারে একটি মুমূর্ষু মানুষের জীবন। ফুলপুর, ময়মনসিংহ।",
  keywords: [
    "ফুলপুর ব্লাড ডোনার নিবন্ধন",
    "রক্তদাতা রেজিস্ট্রেশন ফুলপুর",
    "ফুলপুর ব্লাড ডোনার",
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    "phulpur blood donor registration",
    "become blood donor phulpur",
    "fulpur blood donor",
    "স্বেচ্ছায় রক্তদান ফুলপুর",
  ],
  alternates: {
    canonical: `${siteUrl}/register`,
  },
  openGraph: {
    title: "রক্তদাতা নিবন্ধন | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    description:
      "স্বেচ্ছায় রক্তদাতা হিসেবে যুক্ত হোন এবং মানবতার সেবায় এগিয়ে আসুন। ফুলপুর ব্লাড ডোনার নেটওয়ার্ক।",
    url: `${siteUrl}/register`,
    images: [
      {
        url: "/images/hero-illustration.png",
        width: 1200,
        height: 630,
        alt: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক রক্তদাতা নিবন্ধন",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "রক্তদাতা নিবন্ধন | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    description:
      "স্বেচ্ছায় রক্তদাতা হিসেবে যুক্ত হোন এবং মানবতার সেবায় এগিয়ে আসুন। ফুলপুর ব্লাড ডোনার নেটওয়ার্ক।",
    images: ["/images/hero-illustration.png"],
  },
};

export default function RegisterPage() {
  return <RegisterContent />;
}
