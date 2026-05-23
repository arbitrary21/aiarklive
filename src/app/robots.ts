import type { MetadataRoute } from "next";

export const runtime = "edge";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/login",
          "/welcome",
          "/upload",
          "/profile/me",
          "/api/",
          "/auth/",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
    ],
    sitemap: "https://aiarklive.com/sitemap.xml",
  };
}
