import type { Metadata } from "next";
import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = (): Promise<Metadata> => rootCompatMetadata("prague-to-cesky-krumlov-transfer.html");

export default function PragueToCeskyKrumlovTransferPage() {
  return <RootCompatPage slug="prague-to-cesky-krumlov-transfer.html" />;
}
