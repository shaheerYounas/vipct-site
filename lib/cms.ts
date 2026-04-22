import { unstable_noStore as noStore } from "next/cache";
import { getServiceClient } from "@/lib/supabase";
import { cmsData, copy, faqs, fleet, programs, routes } from "@/lib/site-data";
import type { Language, PublicCmsData } from "@/lib/types";

export async function getPublicCmsData(lang: Language): Promise<PublicCmsData> {
  const supabase = getServiceClient();
  if (!supabase) return cmsData[lang];

  const { data, error } = await supabase
    .from("cms_collections")
    .select("key, language, data")
    .eq("status", "published")
    .eq("language", lang);

  if (error || !data?.length) return cmsData[lang];

  const collections = Object.fromEntries(data.map((row) => [row.key, row.data]));
  return {
    lang,
    copy: isCompleteCopy(collections.copy) ? collections.copy : copy[lang],
    fleet: isCompleteArray(collections.fleet, "image") ? collections.fleet : fleet[lang],
    services: isCompleteArray(collections.services, "image") ? collections.services : cmsData[lang].services,
    programs: isCompleteArray(collections.programs, "image") ? collections.programs : programs[lang],
    routes: isCompleteArray(collections.routes, "slug") ? collections.routes : routes[lang],
    faqs: Array.isArray(collections.faqs) && collections.faqs.length ? collections.faqs : faqs[lang]
  };
}

function isCompleteCopy(value: any): boolean {
  return Boolean(value?.nav && value?.sections && value?.quote && value?.trust);
}

function isCompleteArray(value: any, requiredKey: string): boolean {
  return Array.isArray(value) && value.length > 0 && value.every((item) => item && item[requiredKey]);
}

export async function getAdminCollections() {
  noStore();
  const supabase = getServiceClient();
  if (!supabase) {
    return {
      configured: false,
      collections: Object.entries(cmsData).flatMap(([language, data]) =>
        ["copy", "fleet", "services", "programs", "routes", "faqs"].map((key) => ({
          id: `${language}-${key}`,
          key,
          language,
          status: "local_seed",
          updated_at: null,
          data: data[key as keyof PublicCmsData]
        }))
      )
    };
  }

  const { data, error } = await supabase
    .from("cms_collections")
    .select("id, key, language, status, updated_at, data")
    .order("language", { ascending: true })
    .order("key", { ascending: true });

  if (error) throw error;
  return { configured: true, collections: data ?? [] };
}
