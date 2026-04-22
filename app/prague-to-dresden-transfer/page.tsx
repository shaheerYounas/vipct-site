import type { Metadata } from "next";
import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = (): Promise<Metadata> => rootCompatMetadata("prague-to-dresden-transfer.html");

export default function PragueToDresdenTransferPage() {
  return <RootCompatPage slug="prague-to-dresden-transfer.html" />;
}
