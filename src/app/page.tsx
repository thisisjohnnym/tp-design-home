import localFont from "next/font/local";
import { HeroSequence } from "@/components/hero-sequence/HeroSequence";
import "@/components/hero-sequence/hero-sequence.css";

const helveticaNow = localFont({
  src: "../../public/fonts/HelveticaNowVar.ttf",
  variable: "--font-hs-sans",
  display: "swap",
});

export default function Home() {
  return (
    <div className={helveticaNow.variable}>
      <HeroSequence />
    </div>
  );
}
