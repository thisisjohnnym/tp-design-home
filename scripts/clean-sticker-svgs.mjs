#!/usr/bin/env node
/**
 * Strip Figma export backgrounds from Fun Stickers SVGs:
 * - gray 154×154 canvas rect (#E5E5E5)
 * - large white frame rect (1221×4818)
 * - unwrap redundant "Vector Icons" wrapper group
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const STICKERS_DIR = new URL('../public/stickers', import.meta.url).pathname

function cleanSvg(raw) {
  let svg = raw.replace(/\r\n/g, '\n')

  // Gray export canvas
  svg = svg.replace(/<rect\s+width="154"\s+height="154"\s+fill="#E5E5E5"\s*\/?>\s*/gi, '')

  // Figma artboard frame (white)
  svg = svg.replace(
    /<rect\s+x="[^"]*"\s+y="[^"]*"\s+width="1221"\s+height="4818"[^/]*\/>\s*/gi,
    ''
  )

  // Alternate attribute order / self-closing variants
  svg = svg.replace(
    /<rect[^>]*width="1221"[^>]*height="4818"[^>]*fill="white"[^/]*\/>\s*/gi,
    ''
  )
  svg = svg.replace(
    /<rect[^>]*fill="white"[^>]*width="1221"[^>]*height="4818"[^/]*\/>\s*/gi,
    ''
  )

  // Unwrap Vector Icons container — keep inner sticker group
  svg = svg.replace(/<g id="Vector Icons">\s*/i, '')
  const close = svg.lastIndexOf('</g>')
  const end = svg.lastIndexOf('</svg>')
  if (close !== -1 && close < end) {
    svg = svg.slice(0, close) + svg.slice(close + 5)
  }

  return svg.trimEnd() + '\n'
}

const files = (await readdir(STICKERS_DIR)).filter((f) => f.endsWith('.svg'))
let cleaned = 0

for (const file of files) {
  const path = join(STICKERS_DIR, file)
  const before = await readFile(path, 'utf8')
  const after = cleanSvg(before)
  if (after !== before) {
    await writeFile(path, after)
    cleaned++
  }
}

console.log(`Cleaned ${cleaned}/${files.length} sticker SVGs in public/stickers/`)
