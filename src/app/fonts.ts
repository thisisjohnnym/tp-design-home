import localFont from "next/font/local";

/** DM Sans — self-hosted variable font (avoids Turbopack + next/font/google bug). */
export const dmSans = localFont({
  src: [
    {
      path: "../../public/fonts/dm-sans/DMSans-Variable.ttf",
      weight: "100 1000",
      style: "normal",
    },
    {
      path: "../../public/fonts/dm-sans/DMSans-Italic-Variable.ttf",
      weight: "100 1000",
      style: "italic",
    },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});
