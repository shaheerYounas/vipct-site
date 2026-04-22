import type { Metadata } from "next";
import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = (): Promise<Metadata> => rootCompatMetadata("index.html");

export default function EnglishHomeCompatPage() {
  return <RootCompatPage slug="index.html" />;
}
