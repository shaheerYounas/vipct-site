import { RootCompatPage, rootCompatMetadata } from "@/components/RootCompatPage";

export const revalidate = 300;
export const generateMetadata = () => rootCompatMetadata("prague-to-dresden-transfer.html");
export default function Page() {
  return <RootCompatPage slug="prague-to-dresden-transfer.html" />;
}
