import type { Metadata } from "next";
import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = (): Promise<Metadata> => rootCompatMetadata("prague-to-vienna-transfer.html");

export default function PragueToViennaTransferPage() {
  return <RootCompatPage slug="prague-to-vienna-transfer.html" />;
}
