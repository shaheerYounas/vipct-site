import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = () => rootCompatMetadata("prague-to-vienna-transfer.html");
export default function Page() {
  return <RootCompatPage slug="prague-to-vienna-transfer.html" />;
}
