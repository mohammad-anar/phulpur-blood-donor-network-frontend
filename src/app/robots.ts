import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://phulpurblooddonornetwork.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/donors",
          "/about",
          "/contact",
          "/register",
          "/login",
          "/images/",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/donor",
          "/donor/*",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/change-password",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

