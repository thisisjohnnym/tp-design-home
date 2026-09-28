import type { Metadata } from "next";
import localFont from "next/font/local";
import { DisableOverscroll } from "@/components/DisableOverscroll";
import "./globals.css";

const helveticaNow = localFont({
  src: "../../public/fonts/HelveticaNowVar.ttf",
  variable: "--font-hs-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tapestry Design",
  description: "Tapestry Design Team hero experiment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-overscroll">
      <body className={helveticaNow.variable}>
        <DisableOverscroll />
        {children}
      </body>
    </html>
  );
}
