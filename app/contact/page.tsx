import type { Metadata } from "next";
import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = (): Promise<Metadata> => rootCompatMetadata("contact.html");

export default function ContactPage() {
  return <RootCompatPage slug="contact.html" />;
}
