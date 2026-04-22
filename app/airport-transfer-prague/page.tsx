import type { Metadata } from "next";
import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = (): Promise<Metadata> => rootCompatMetadata("airport-transfer-prague.html");

export default function AirportTransferPage() {
  return <RootCompatPage slug="airport-transfer-prague.html" />;
}
