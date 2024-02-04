import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GEMPAX | Earthquake Spatial Data Analytics",
  description:
    "GEMPAX is a web-based platform for earthquake spatial data analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="corporate" lang="en">
      <body className={inter.className + " h-screen w-screen"}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
