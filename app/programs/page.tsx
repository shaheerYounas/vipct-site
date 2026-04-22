import type { Metadata } from "next";
import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = (): Promise<Metadata> => rootCompatMetadata("programs.html");

export default function ProgramsPage() {
  return <RootCompatPage slug="programs.html" />;
}
