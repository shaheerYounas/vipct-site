import type { Metadata } from "next";
import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = (): Promise<Metadata> => rootCompatMetadata("thankyou.html");

export default function ThankYouPage() {
  return <RootCompatPage slug="thankyou.html" />;
}
