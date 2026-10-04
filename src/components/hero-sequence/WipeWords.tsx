/** Text split into words so a row wipe (wipe-reveal.ts) can measure its rows. */
export function WipeWords({ text }: { text: string }) {
  return text.split(" ").map((word, index) => (
    <span key={index}>
      {index > 0 && " "}
      <span className="hs-wipe__word">{word}</span>
    </span>
  ));
}
