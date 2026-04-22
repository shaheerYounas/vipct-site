import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = () => rootCompatMetadata("quote.html");
export default function Page() {
  return <RootCompatPage slug="quote.html" />;
}
