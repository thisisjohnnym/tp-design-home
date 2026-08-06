import localFont from "next/font/local";
import "./experiment.css";

const helveticaNow = localFont({
  src: "../../../public/fonts/HelveticaNowVar.ttf",
  variable: "--font-experiment-sans",
  display: "swap",
});

const lokanova = localFont({
  src: "../../../public/fonts/Lokanova-Std.otf",
  variable: "--font-experiment-display",
  display: "swap",
});

export default function ExperimentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${helveticaNow.variable} ${lokanova.variable}`}>
      {children}
    </div>
  );
}
