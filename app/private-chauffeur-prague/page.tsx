import type { Metadata } from "next";
import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = (): Promise<Metadata> => rootCompatMetadata("private-chauffeur-prague.html");

export default function PrivateChauffeurPage() {
  return <RootCompatPage slug="private-chauffeur-prague.html" />;
}
