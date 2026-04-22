import { company, languages, publicSlugs } from "@/lib/site-data";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(languages) as Array<keyof typeof languages>).flatMap((lang) =>
    publicSlugs.map((slug) => ({
      url: `${company.siteUrl}/${lang}/${slug}`,
      lastModified: new Date()
    }))
  );
}
