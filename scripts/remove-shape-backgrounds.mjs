import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

const DIR = path.join(process.cwd(), 'public/objects/process')
const THRESHOLD = 28

async function removeBlackBackground(filePath) {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (r <= THRESHOLD && g <= THRESHOLD && b <= THRESHOLD) {
      data[i + 3] = 0
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(filePath)
}

const files = (await readdir(DIR)).filter((f) => f.endsWith('.png'))
for (const file of files) {
  const filePath = path.join(DIR, file)
  await removeBlackBackground(filePath)
  console.log(`processed ${file}`)
}
