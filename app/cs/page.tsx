import type { Metadata } from "next";
import { PageRenderer } from "@/components/PageRenderer";
import { getPublicCmsData } from "@/lib/cms";
import { canonicalHref } from "@/lib/site-data";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPublicCmsData("cs");
  return {
    title: data.copy.homeTitle,
    description: data.copy.homeLead,
    alternates: {
      canonical: canonicalHref("cs", "index.html"),
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
      url: canonicalHref("cs", "index.html"),
      images: ["/assets/optimized/hero.webp"]
    }
  };
}

export default async function CzechHomePage() {
  const data = await getPublicCmsData("cs");
  return <PageRenderer lang="cs" slug="index.html" data={data} />;
}
