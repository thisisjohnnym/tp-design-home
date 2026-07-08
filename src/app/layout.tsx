import type { Metadata } from "next";
import { dmSans } from "./fonts";
import "./globals.css";
import { ConditionalChrome } from "@/components/layout/ConditionalChrome";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";

export const metadata: Metadata = {
  title: {
    default: "Tapestry Design Team",
    template: "%s",
  },
  description:
    "Designing the connective tissue of Tapestry's product experience — team, capabilities, assets, and how we work.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={dmSans.variable} data-palette="studio" data-mode="light" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
      </head>
      <body
        className={`${dmSans.className} bg-[var(--background)] font-sans text-[var(--foreground)] antialiased`}
      >
        <ThemeProvider>
          <ConditionalChrome>{children}</ConditionalChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
