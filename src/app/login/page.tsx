import type { Metadata } from "next";
import { LoginContent } from "./LoginContent";

const siteUrl = "https://phulpurblooddonornetwork.vercel.app";

export const metadata: Metadata = {
  title: "লগইন | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
  description:
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক অ্যাকাউন্টে লগইন করুন। রক্তদানের তথ্য আপডেট করুন ও আপনার ডোনার প্রোফাইল পরিচালনা করুন। ফুলপুর, ময়মনসিংহ।",
  keywords: [
    "ফুলপুর ব্লাড ডোনার লগইন",
    "রক্তদাতা লগইন ফুলপুর",
    "phulpur blood donor login",
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
  ],
  alternates: {
    canonical: `${siteUrl}/login`,
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginContent />;
}
