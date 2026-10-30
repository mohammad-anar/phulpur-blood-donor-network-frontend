import type { Metadata, Viewport } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ToastProvider } from "@/components/common/Toast";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const siteUrl = "https://phulpurblooddonornetwork.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#b91c1c",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক | Phulpur Blood Donor Network",
    template: "%s | ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
  },
  description:
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক (Phulpur Blood Donor Network) - ফুলপুর ও আশপাশের এলাকায় জরুরি প্রয়োজনে বিনামূল্যে রক্তদাতা খুঁজুন এবং রক্তদাতা হিসেবে নিবন্ধন করে মুমূর্ষু রোগীর পাশে দাঁড়ান। ফুলপুর, ময়মনসিংহ।",
  keywords: [
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    "ফুলপুর ব্লাড ডোনার",
    "phulpur blood donor network",
    "phulpur blood donor",
    "fulpur blood donor network",
    "fulpur blood donor",
    "ফুলপুর রক্তদান",
    "ফুলপুর রক্তদাতা",
    "ফুলপুর ব্লাড ব্যাংক",
    "ফুলপুরে রক্তের সন্ধান",
    "জরুরি রক্ত ফুলপুর",
    "রক্ত দিন জীবন বাঁচান ফুলপুর",
    "ময়মনসিংহ রক্তদান",
    "blood donor in phulpur",
    "phulpur blood donation",
    "phulpur blood bank",
    "emergency blood phulpur",
    "mymensingh blood donor network",
  ],
  authors: [{ name: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক", url: siteUrl }],
  creator: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
  publisher: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
  applicationName: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
  category: "Health & Medical",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: siteUrl,
    siteName: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
    title: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক | রক্ত দিন, জীবন বাঁচান",
    description:
      "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক - ফুলপুর ও আশপাশের এলাকায় জরুরি প্রয়োজনে দ্রুত রক্তদাতা খুঁজুন এবং রক্তদাতা হিসেবে যুক্ত হয়ে মানুষের জীবন বাঁচান।",
    images: [
      {
        url: `${siteUrl}/favicon.png`,
        width: 333,
        height: 478,
        alt: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক | Phulpur Blood Donor Network",
    description:
      "জরুরি প্রয়োজনে রক্তদাতা খুঁজুন ও স্বেচ্ছায় রক্তদান করুন। ফুলপুর, ময়মনসিংহ।",
    images: [`${siteUrl}/favicon.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.png",
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "google011de0bb51af2a18",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalOrganization",
      "@id": `${siteUrl}/#organization`,
      name: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
      alternateName: [
        "Phulpur Blood Donor Network",
        "ফুলপুর ব্লাড ডোনার",
        "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক",
        "Phulpur Blood Donor",
        "ফুলপুর রক্তদান",
      ],
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.png`,
        width: 333,
        height: 478,
      },
      image: `${siteUrl}/favicon.png`,
      description:
        "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক ময়মনসিংহের ফুলপুর উপজেলার জরুরি রক্তদান ও রক্তদাতা খোঁজার একটি উন্মুক্ত মানবিক প্ল্যাটফর্ম।",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Phulpur",
        addressRegion: "Mymensingh",
        addressCountry: "BD",
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Phulpur Upazila, Mymensingh",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক | Phulpur Blood Donor Network",
      alternateName: "Phulpur Blood Donor Network",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "bn-BD",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/donors?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning className={hindSiliguri.variable}>
      <head>
        {/* WhatsApp & Social Media OpenGraph Image tags */}
        <meta property="og:image" content={`${siteUrl}/favicon.png`} />
        <meta property="og:image:secure_url" content={`${siteUrl}/favicon.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="333" />
        <meta property="og:image:height" content="478" />
        <meta property="og:image:alt" content="ফুলপুর ব্লাড ডোনার নেটওয়ার্ক" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased transition-colors duration-200">
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
