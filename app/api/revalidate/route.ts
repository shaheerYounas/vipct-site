import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { languages, pageHref, publicSlugs, rootHref } from "@/lib/site-data";
import type { Language } from "@/lib/types";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret") || request.nextUrl.searchParams.get("secret");
  if (!getEnv("REVALIDATE_SECRET") || secret !== getEnv("REVALIDATE_SECRET")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const slug = typeof body.slug === "string" ? body.slug : undefined;
  const lang = typeof body.lang === "string" ? (body.lang as Language) : undefined;

  if (slug && lang && Object.prototype.hasOwnProperty.call(languages, lang)) {
    revalidatePath(pageHref(lang, slug));
    if (lang === "en") revalidatePath(rootHref(slug));
    return NextResponse.json({ revalidated: [pageHref(lang, slug)] });
  }

  for (const language of Object.keys(languages) as Language[]) {
    for (const pageSlug of publicSlugs) revalidatePath(pageHref(language, pageSlug));
  }
  publicSlugs.forEach((pageSlug) => revalidatePath(rootHref(pageSlug)));
  return NextResponse.json({ revalidated: "all_public_pages" });
}
