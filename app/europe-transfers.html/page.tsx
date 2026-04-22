import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = () => rootCompatMetadata("europe-transfers.html");
export default function Page() {
  return <RootCompatPage slug="europe-transfers.html" />;
}
