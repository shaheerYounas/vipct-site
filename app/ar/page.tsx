import type { Metadata } from "next";
import { PageRenderer } from "@/components/PageRenderer";
import { getPublicCmsData } from "@/lib/cms";
import { canonicalHref } from "@/lib/site-data";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPublicCmsData("ar");
  return {
    title: data.copy.homeTitle,
    description: data.copy.homeLead,
    alternates: {
      canonical: canonicalHref("ar", "index.html"),
      languages: {
        en: canonicalHref("en", "index.html"),
        cs: canonicalHref("cs", "index.html"),
        ar: canonicalHref("ar", "index.html"),
        "x-default": canonicalHref("en", "index.html")
      }
    },
    openGraph: {
      title: data.copy.homeTitle,
      description: data.copy.homeLead,
      url: canonicalHref("ar", "index.html"),
      images: ["/assets/optimized/hero.webp"]
    }
  };
}

export default async function ArabicHomePage() {
  const data = await getPublicCmsData("ar");
  return <PageRenderer lang="ar" slug="index.html" data={data} />;
}
