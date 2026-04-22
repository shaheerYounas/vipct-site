import type { Metadata } from "next";
import { PageRenderer } from "@/components/PageRenderer";
import { getPublicCmsData } from "@/lib/cms";
import { canonicalHref, company, getRouteBySlug, pageHref, rootHref } from "@/lib/site-data";
import type { Language } from "@/lib/types";

export async function RootCompatPage({ slug }: { slug: string }) {
  const data = await getPublicCmsData("en");
  return <PageRenderer lang="en" slug={slug} data={data} rootCompat />;
}

export async function rootCompatMetadata(slug: string): Promise<Metadata> {
  return publicPageMetadata("en", slug, true);
}

export async function publicPageMetadata(lang: Language, slug: string, rootCompat = false): Promise<Metadata> {
  const data = await getPublicCmsData(lang);
  const c = data.copy;
  const route = getRouteBySlug(lang, slug);
  const canonical = canonicalHref(lang, slug, rootCompat);
  const englishHref = rootHref(slug);

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
      canonical,
      languages: {
        en: englishHref,
        cs: pageHref("cs", slug),
        ar: pageHref("ar", slug),
        "x-default": englishHref
      }
    },
    openGraph: { title, description, url: canonical, images: [route?.image || "/assets/optimized/hero.webp"] },
    robots: slug === "thankyou.html" ? { index: false, follow: true } : undefined
  };
}

export async function legacyLocalizedMetadata(lang: Language, slug: string): Promise<Metadata> {
  return publicPageMetadata(lang, slug, false);
}

export async function legacyRootMetadata(slug: string): Promise<Metadata> {
  const data = await getPublicCmsData("en");
  const c = data.copy;
  const route = getRouteBySlug("en", slug);
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
      canonical: rootHref(slug),
      languages: {
        en: rootHref(slug),
        cs: pageHref("cs", slug),
        ar: pageHref("ar", slug),
        "x-default": rootHref(slug)
      }
    },
    openGraph: { title, description, url: rootHref(slug), images: [route?.image || "/assets/optimized/hero.webp"] },
    robots: slug === "thankyou.html" ? { index: false, follow: true } : undefined
  };
}
