import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { DisableOverscroll } from "@/components/DisableOverscroll";
import "./globals.css";

const helveticaNow = localFont({
  src: "../../public/fonts/HelveticaNowVar.ttf",
  /* Variable font: without the wght range the face is treated as 400 only,
     so bolds get synthesized and lights snap to regular. */
  weight: "50 1000",
  variable: "--font-hs-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tapestry Design",
  description: "Tapestry Design Team hero experiment",
};

/* Page canvas color, so browser chrome (URL bar, overscroll) stays dark. */
export const viewport: Viewport = {
  themeColor: "#080806",
  colorScheme: "dark",
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
