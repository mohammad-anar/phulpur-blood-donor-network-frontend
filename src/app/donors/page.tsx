import type { Metadata } from "next";
import { DonorsContent } from "./DonorsContent";

const siteUrl = "https://phulpurblooddonornetwork.vercel.app";

export const metadata: Metadata = {
  title: "রক্তদাতা খুঁজুন | ফুলপুর ব্লাড ডোনার - Phulpur Blood Donor",
  description:
    "ফুলপুর উপজেলার A+, A-, B+, B-, AB+, AB-, O+, O- সহ সকল রক্তের গ্রুপের সক্রিয় রক্তদাতাদের তালিকা। জরুরি প্রয়োজনে সরাসরি রক্তদাতার সাথে যোগাযোগ করুন। ফুলপুর ব্লাড ডোনার নেটওয়ার্ক।",
  keywords: [
    "ফুলপুর ব্লাড ডোনার",
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    "ফুলপুর রক্তদাতা তালিকা",
    "phulpur blood donor",
    "phulpur blood donor list",
    "phulpur blood donor network",
    "fulpur blood donor",
    "find blood donor phulpur",
    "জরুরি রক্ত ফুলপুর",
    "ফুলপুর রক্তদান",
    "রক্তের সন্ধান ফুলপুর",
    "blood donors in phulpur mymensingh",
  ],
  alternates: {
    canonical: `${siteUrl}/donors`,
  },
  openGraph: {
    title: "রক্তদাতা খুঁজুন | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    description:
      "ফুলপুর উপজেলার সকল সক্রিয় রক্তদাতাদের তালিকা। জরুরি প্রয়োজনে যে কোনো গ্রুপের রক্তদাতা খুঁজুন।",
    url: `${siteUrl}/donors`,
    images: [
      {
        url: `${siteUrl}/favicon.png`,
        width: 333,
        height: 478,
        alt: "ফুলপুর ব্লাড ডোনার - রক্তদাতা খুঁজুন",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "রক্তদাতা খুঁজুন | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    description:
      "ফুলপুর উপজেলার সক্রিয় রক্তদাতাদের তালিকা। জরুরি প্রয়োজনে যে কোনো রক্তের গ্রুপের ডোনার খুঁজুন।",
    images: [`${siteUrl}/favicon.png`],
  },
};

export default function DonorsPage() {
  return <DonorsContent />;
}
