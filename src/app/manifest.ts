import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক | Phulpur Blood Donor Network",
    short_name: "ফুলপুর ব্লাড ডোনার",
    description:
      "ফুলপুর ব্লাড ডোনার নেটওয়ার্ক - জরুরি প্রয়োজনে রক্তদাতা খুঁজুন ও স্বেচ্ছায় রক্তদান করুন। ফুলপুর, ময়মনসিংহ।",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#b91c1c",
    lang: "bn",
    icons: [
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

