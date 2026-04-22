import type { Metadata } from "next";
import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = (): Promise<Metadata> => rootCompatMetadata("europe-transfers.html");

export default function EuropeTransfersPage() {
  return <RootCompatPage slug="europe-transfers.html" />;
}
