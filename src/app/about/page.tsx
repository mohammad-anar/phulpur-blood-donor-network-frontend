import type { Metadata } from "next";
import { AboutContent } from "./AboutContent";

const siteUrl = "https://phulpurblooddonornetwork.vercel.app";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক - Phulpur Blood Donor",
  description:
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক (Phulpur Blood Donor Network) ময়মনসিংহের ফুলপুর উপজেলার একটি অলাভজনক মানবিক উদ্যোগ। স্বেচ্ছায় রক্তদান ও মুমূর্ষু রোগীর পাশে দাঁড়ানোই আমাদের মূল লক্ষ্য।",
  keywords: [
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    "ফুলপুর ব্লাড ডোনার",
    "phulpur blood donor network",
    "phulpur blood donor",
    "fulpur blood donor",
    "আমাদের সম্পর্কে",
    "স্বেচ্ছায় রক্তদান ফুলপুর",
    "ফুলপুর রক্তদান সংগঠন",
    "About Phulpur Blood Donor Network",
    "ফুলপুর ময়মনসিংহ রক্তসেবা",
  ],
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "আমাদের সম্পর্কে | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    description:
      "রক্তদানে এগিয়ে আসি, বাঁচাই মানুষের প্রাণ। ফুলপুর ব্লাড ডোনার নেটওয়ার্ক একটি মানবিক ও অলাভজনক উদ্যোগ।",
    url: `${siteUrl}/about`,
    images: [
      {
        url: `${siteUrl}/favicon.png`,
        width: 333,
        height: 478,
        alt: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক আমাদের সম্পর্কে",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "আমাদের সম্পর্কে | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    description:
      "রক্তদানে এগিয়ে আসি, বাঁচাই মানুষের প্রাণ। ফুলপুর ব্লাড ডোনার নেটওয়ার্ক একটি মানবিক ও অলাভজনক উদ্যোগ।",
    images: [`${siteUrl}/favicon.png`],
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
