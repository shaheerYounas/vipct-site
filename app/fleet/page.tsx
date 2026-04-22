import type { Metadata } from "next";
import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = (): Promise<Metadata> => rootCompatMetadata("fleet.html");

export default function FleetPage() {
  return <RootCompatPage slug="fleet.html" />;
}
