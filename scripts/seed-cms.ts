import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { cmsData, company, publicSlugs, getRouteBySlug } from "../lib/site-data";
import type { Language } from "../lib/types";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(url, serviceRole, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const languages: Language[] = ["en", "cs", "ar"];

await supabase.from("site_settings").upsert({
  key: "company",
  value: company
});

for (const lang of languages) {
  const data = cmsData[lang];
  const collections = [
    ["copy", data.copy],
    ["fleet", data.fleet],
    ["services", data.services],
    ["programs", data.programs],
    ["routes", data.routes],
    ["faqs", data.faqs]
  ] as const;

  for (const [key, value] of collections) {
    const { error } = await supabase.from("cms_collections").upsert(
      {
        key,
        language: lang,
        status: "published",
        data: value
      },
      { onConflict: "key,language" }
    );
    if (error) throw error;
  }

  for (const slug of publicSlugs) {
    const route = getRouteBySlug(lang, slug);
    const title = pageTitle(lang, slug);
    const description = route?.description || pageDescription(lang, slug);
    const { error } = await supabase.from("cms_pages").upsert(
      {
        slug,
        language: lang,
        status: "published",
        title,
        description,
        content: {
          kind: pageKind(slug),
          routeKey: route?.key ?? null
        },
        seo: {
          title,
          description
        }
      },
      { onConflict: "slug,language" }
    );
    if (error) throw error;
  }
}

console.log("Seeded full VIPCT CMS content.");

function pageTitle(lang: Language, slug: string): string {
  const data = cmsData[lang];
  const route = getRouteBySlug(lang, slug);
  if (route) return route.title;
  if (slug === "index.html") return data.copy.homeTitle;
  if (slug === "services.html") return data.copy.sections.servicesTitle;
  if (slug === "fleet.html") return data.copy.sections.fleetTitle;
  if (slug === "programs.html") return data.copy.sections.programsTitle;
  if (slug === "quote.html") return data.copy.quote.title;
  if (slug === "contact.html") return data.copy.contactTitle;
  if (slug === "thankyou.html") return data.copy.thankTitle;
  return company.company;
}

function pageDescription(lang: Language, slug: string): string {
  const data = cmsData[lang];
  if (slug === "index.html") return data.copy.homeLead;
  if (slug === "quote.html") return data.copy.quote.lead;
  if (slug === "contact.html") return data.copy.contactLead;
  if (slug === "fleet.html") return data.copy.sections.fleetText;
  if (slug === "programs.html") return data.copy.sections.programsText;
  return data.copy.sections.servicesText;
}

function pageKind(slug: string): string {
  if (slug === "index.html") return "home";
  if (slug.endsWith(".html") && !["services.html", "fleet.html", "programs.html", "quote.html", "contact.html", "thankyou.html"].includes(slug)) {
    return "route";
  }
  return slug.replace(".html", "");
}
