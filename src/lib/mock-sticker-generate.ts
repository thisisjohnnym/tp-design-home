import { STICKERS } from '@/components/stickers/stickerCatalog'

function hashPrompt(prompt: string) {
  let hash = 0
  for (let i = 0; i < prompt.length; i++) {
    hash = (hash * 31 + prompt.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function isStickerGenerateMockEnabled() {
  if (process.env.STICKER_GENERATE_MOCK === 'true') return true
  if (process.env.STICKER_GENERATE_MOCK === 'false') return false
  return process.env.NODE_ENV === 'development'
}

export async function mockGenerateSticker(prompt: string) {
  const delayMs = 6000
  await new Promise((resolve) => setTimeout(resolve, delayMs))

  const sticker = STICKERS[hashPrompt(prompt.toLowerCase()) % STICKERS.length]

  return {
    id: `mock-${Date.now()}`,
    label: prompt,
    src: sticker.src,
  }
}
