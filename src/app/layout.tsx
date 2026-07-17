import type { Metadata } from "next";
import { Suspense } from "react";
import { ConditionalChrome } from "@/components/layout/ConditionalChrome";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tapestry Design Team",
  description: "Internal design team site — in progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-palette="studio"
      data-mode="light"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <CustomCursor />
          <Suspense fallback={null}>
            <ConditionalChrome>
              <main id="main">{children}</main>
            </ConditionalChrome>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
