import { DM_Sans } from "next/font/google";

/** DM Sans — site-wide typography (400–700). */
export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});
