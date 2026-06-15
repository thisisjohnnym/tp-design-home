const STYLE_PREFIX = `Hand-drawn fun sticker illustration in the style of playful FigJam stickers.
Bold dark outlines, flat matte colors, simple shapes, single centered subject.
No background, no border, no drop shadow, no frame, no text unless explicitly requested.
Transparent background. Sticker art only.`

const SAFETY_RULES = `Content rules (mandatory):
- Only wholesome, playful, family-friendly subjects suitable for a workplace design tool.
- Do NOT depict violence, weapons, blood, gore, hate symbols, harassment, drugs, alcohol, smoking, gambling, illegal activity, nudity, sexual content, fetish content, or anything offensive, scary, or inappropriate.
- Do NOT include slurs, profanity, political propaganda, or real public figures.`

export function buildStickerPrompt(userPrompt: string) {
  const trimmed = userPrompt.trim().slice(0, 280)
  return `${STYLE_PREFIX}\n\n${SAFETY_RULES}\n\nSubject: ${trimmed}`
}
