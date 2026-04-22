import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = () => rootCompatMetadata("airport-transfer-prague.html");
export default function Page() {
  return <RootCompatPage slug="airport-transfer-prague.html" />;
}
