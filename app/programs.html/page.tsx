import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = () => rootCompatMetadata("programs.html");
export default function Page() {
  return <RootCompatPage slug="programs.html" />;
}
