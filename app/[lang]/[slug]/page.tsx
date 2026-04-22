import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageRenderer } from "@/components/PageRenderer";
import { getPublicCmsData } from "@/lib/cms";
import { company, getRouteBySlug, languages, publicSlugs } from "@/lib/site-data";
import type { Language } from "@/lib/types";

export const revalidate = 300;

interface Params {
  lang: Language;
  slug: string;
}

export function generateStaticParams() {
  return (Object.keys(languages) as Language[]).flatMap((lang) => publicSlugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!Object.prototype.hasOwnProperty.call(languages, lang)) notFound();
  return pageMetadata(lang, slug);
}

export default async function LocalizedPage({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  if (!Object.prototype.hasOwnProperty.call(languages, lang) || !publicSlugs.includes(slug)) notFound();
  const data = await getPublicCmsData(lang);
  return <PageRenderer lang={lang} slug={slug} data={data} />;
}

async function pageMetadata(lang: Language, slug: string): Promise<Metadata> {
  const data = await getPublicCmsData(lang);
  const c = data.copy;
  const route = getRouteBySlug(lang, slug);
  const title =
    slug === "index.html"
      ? c.homeTitle
      : slug === "services.html"
        ? c.sections.servicesTitle
        : slug === "fleet.html"
          ? c.sections.fleetTitle
          : slug === "programs.html"
            ? c.sections.programsTitle
            : slug === "quote.html"
              ? c.quote.title
              : slug === "contact.html"
                ? c.contactTitle
                : slug === "thankyou.html"
                  ? c.thankTitle
                  : route?.title || company.company;
  const description =
    route?.description ||
    (slug === "index.html"
      ? c.homeLead
      : slug === "quote.html"
        ? c.quote.lead
        : slug === "contact.html"
          ? c.contactLead
          : c.sections.servicesText);

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/${slug}`,
      languages: {
        en: `/en/${slug}`,
        cs: `/cs/${slug}`,
        ar: `/ar/${slug}`,
        "x-default": `/en/${slug}`
      }
    },
    openGraph: { title, description, url: `/${lang}/${slug}`, images: [route?.image || "/assets/optimized/hero.webp"] },
    robots: slug === "thankyou.html" ? { index: false, follow: true } : undefined
  };
}
