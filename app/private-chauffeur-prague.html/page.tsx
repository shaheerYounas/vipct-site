import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = () => rootCompatMetadata("private-chauffeur-prague.html");
export default function Page() {
  return <RootCompatPage slug="private-chauffeur-prague.html" />;
}
