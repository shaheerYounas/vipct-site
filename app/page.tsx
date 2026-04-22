import { PageRenderer } from "@/components/PageRenderer";
import { getPublicCmsData } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPublicCmsData("en");
  return <PageRenderer lang="en" slug="index.html" data={data} rootCompat />;
}
