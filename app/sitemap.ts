import type { MetadataRoute } from "next";
import { SERVICE_PACKAGES, WORKSHOPS } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://moholt.is";
  const now = new Date().toISOString();

  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: "monthly" as const, priority: 1.0 },
    { url: `${baseUrl}/thjonusta`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/vinnustofur`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/samningar`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/heilsufarsmat`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/um`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${baseUrl}/personuvernd`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/skilmalar`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const servicePages = SERVICE_PACKAGES.map(p => ({
    url: `${baseUrl}/thjonusta/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const workshopPages = WORKSHOPS.map(w => ({
    url: `${baseUrl}/vinnustofur/${w.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...workshopPages];
}
