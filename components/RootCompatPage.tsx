import type { Metadata } from "next";
import { PageRenderer } from "@/components/PageRenderer";
import { getPublicCmsData } from "@/lib/cms";
import { company, getRouteBySlug } from "@/lib/site-data";

export async function RootCompatPage({ slug }: { slug: string }) {
  const data = await getPublicCmsData("en");
  return <PageRenderer lang="en" slug={slug} data={data} rootCompat />;
}

export async function rootCompatMetadata(slug: string): Promise<Metadata> {
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
      canonical: `/${slug}`,
      languages: {
        en: `/en/${slug}`,
        cs: `/cs/${slug}`,
        ar: `/ar/${slug}`,
        "x-default": `/en/${slug}`
      }
    },
    openGraph: { title, description, url: `/${slug}`, images: [route?.image || "/assets/optimized/hero.webp"] },
    robots: slug === "thankyou.html" ? { index: false, follow: true } : undefined
  };
}
