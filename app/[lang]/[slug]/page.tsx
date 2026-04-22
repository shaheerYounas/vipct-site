import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legacyLocalizedMetadata } from "@/components/RootCompatPage";
import { PageRenderer } from "@/components/PageRenderer";
import { getPublicCmsData } from "@/lib/cms";
import { languages, publicSegments, resolvePublicSlug } from "@/lib/site-data";
import type { Language } from "@/lib/types";

export const revalidate = 300;

interface Params {
  lang: Language;
  slug: string;
}

export function generateStaticParams() {
  return (Object.keys(languages) as Language[]).flatMap((lang) => publicSegments.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!Object.prototype.hasOwnProperty.call(languages, lang)) notFound();
  const resolved = resolvePublicSlug(slug);
  if (!resolved) notFound();
  return legacyLocalizedMetadata(lang, resolved);
}

export default async function LocalizedPage({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  const resolved = resolvePublicSlug(slug);
  if (!Object.prototype.hasOwnProperty.call(languages, lang) || !resolved) notFound();
  const data = await getPublicCmsData(lang);
  return <PageRenderer lang={lang} slug={resolved} data={data} />;
}
