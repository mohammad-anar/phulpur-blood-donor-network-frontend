import type { Metadata } from "next";
import { ContactContent } from "./ContactContent";

const siteUrl = "https://phulpurblooddonornetwork.vercel.app";

export const metadata: Metadata = {
  title: "যোগাযোগ | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক - Phulpur Blood Donor",
  description:
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্কের সাথে যোগাযোগ করুন। জরুরি রক্তদান সহায়তা, পরামর্শ অথবা যে কোনো প্রয়োজনে আমাদের সাথে সরাসরি যুক্ত হতে পারেন। ফুলপুর, ময়মনসিংহ।",
  keywords: [
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    "ফুলপুর ব্লাড ডোনার",
    "phulpur blood donor network",
    "phulpur blood donor",
    "fulpur blood donor",
    "যোগাযোগ",
    "ফুলপুর রক্তদান সহায়তা",
    "ফুলপুর ব্লাড ডোনার ফোন নম্বর",
    "ফুলপুর রক্তদান হেল্পলাইন",
    "Contact Phulpur Blood Donor Network",
  ],
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "যোগাযোগ | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    description:
      "আপনার কোনো প্রশ্ন, জরুরি রক্তদান পরামর্শ বা সহযোগিতার প্রয়োজন হলে ফুলপুর ব্লাড ডোনার নেটওয়ার্কের সাথে যোগাযোগ করুন।",
    url: `${siteUrl}/contact`,
    images: [
      {
        url: `${siteUrl}/favicon.png`,
        width: 333,
        height: 478,
        alt: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক যোগাযোগ",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "যোগাযোগ | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    description:
      "জরুরি রক্তদান পরামর্শ বা সহযোগিতার প্রয়োজন হলে ফুলপুর ব্লাড ডোনার নেটওয়ার্কের সাথে যোগাযোগ করুন।",
    images: [`${siteUrl}/favicon.png`],
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
