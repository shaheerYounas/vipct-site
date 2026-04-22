import type { Metadata } from "next";
import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = (): Promise<Metadata> => rootCompatMetadata("quote.html");

export default function QuotePage() {
  return <RootCompatPage slug="quote.html" />;
}
