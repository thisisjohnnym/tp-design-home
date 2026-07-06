import { DEFAULT_MODE, DEFAULT_PALETTE_ID, STORAGE_KEYS } from "@/content/themes";

/** Runs before paint to avoid theme flash */
export function ThemeScript() {
  const script = `(function(){try{var p=localStorage.getItem("${STORAGE_KEYS.palette}")||"${DEFAULT_PALETTE_ID}";var m=localStorage.getItem("${STORAGE_KEYS.mode}")||"${DEFAULT_MODE}";document.documentElement.setAttribute("data-palette",p);document.documentElement.setAttribute("data-mode",m);document.documentElement.style.colorScheme=m;}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
