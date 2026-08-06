import type { Metadata } from "next";
import localFont from "next/font/local";
import "./experiment.css";

const helveticaNow = localFont({
  src: "../../public/fonts/HelveticaNowVar.ttf",
  variable: "--font-experiment-sans",
  display: "swap",
});

const lokanova = localFont({
  src: "../../public/fonts/Lokanova-Std.otf",
  variable: "--font-experiment-display",
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
    <html lang="en">
      <body className={`${helveticaNow.variable} ${lokanova.variable}`}>
        {children}
      </body>
    </html>
  );
}
