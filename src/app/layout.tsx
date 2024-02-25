import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Filters from "@/components/reusables/sidebar/filters";
import { FilterProvider } from "@/components/context/use-filter";
import { ApiProvider } from "@/components/context/use-api";
import Widgets from "@/components/reusables/sidebar/widgets";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GEMPAX | Earthquake Spatial Data Analytics",
  description:
    "GEMPAX is a web-based platform for earthquake spatial data analytics.",
  authors: {
    name: "Azka",
    url: "https://mazka.dev/",
  },
  keywords: ["earthquake", "spatial", "data", "analytics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="corporate" lang="en">
      <body className={inter.className + " h-screen w-screen"}>
        <main className="flex h-full w-full">
          <ApiProvider>
            <FilterProvider>
              <section className="w-full max-w-xs bg-slate-50">
                <Filters />
              </section>
              <section className="h-full w-full">{children}</section>
              <section className="w-full max-w-xs bg-slate-50">
                <Widgets />
              </section>
            </FilterProvider>
          </ApiProvider>
        </main>
        <Analytics />
      </body>
    </html>
  );
}
