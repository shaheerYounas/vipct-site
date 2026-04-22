import type { Metadata } from "next";
import { PageRenderer } from "@/components/PageRenderer";
import { rootCompatMetadata } from "@/components/RootCompatPage";
import { getPublicCmsData } from "@/lib/cms";

export const dynamic = "force-dynamic";
export const generateMetadata = (): Promise<Metadata> => rootCompatMetadata("index.html");

export default async function HomePage() {
  const data = await getPublicCmsData("en");
  return <PageRenderer lang="en" slug="index.html" data={data} rootCompat />;
}
