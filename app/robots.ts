import { company } from "@/lib/site-data";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${company.siteUrl}/sitemap.xml`
  };
}
