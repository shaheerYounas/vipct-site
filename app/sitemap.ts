import { company, pageHref, publicSlugs, rootHref } from "@/lib/site-data";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const localized = (["cs", "ar"] as const).flatMap((lang) =>
    publicSlugs.map((slug) => ({
      url: `${company.siteUrl}${pageHref(lang, slug)}`,
      lastModified: new Date()
    }))
  );

  const english = publicSlugs.map((slug) => ({
    url: `${company.siteUrl}${rootHref(slug)}`,
    lastModified: new Date()
  }));

  return [...english, ...localized];
}
