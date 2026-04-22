import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = () => rootCompatMetadata("prague-to-cesky-krumlov-transfer.html");
export default function Page() {
  return <RootCompatPage slug="prague-to-cesky-krumlov-transfer.html" />;
}
