import "./globals.css";
import type { Metadata } from "next";
import type React from "react";
import { company } from "@/lib/site-data";

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: {
    default: company.company,
    template: `%s | ${company.company}`
  },
  icons: {
    icon: "/assets/favicon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/assets/style.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
