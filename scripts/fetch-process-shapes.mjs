import sharp from 'sharp'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const SHAPES = [
  { file: 'shape-10.png', raw: ['https://www.figma.com/api/mcp/asset/2b13b05e-afc6-4e3c-9aaa-d3a061c27252', 'https://www.figma.com/api/mcp/asset/33378aef-0282-4ce5-b513-55775bf19776'] },
  { file: 'shape-16.png', raw: ['https://www.figma.com/api/mcp/asset/934ae0fb-5bb5-4cca-ac38-b37b71ea6952', 'https://www.figma.com/api/mcp/asset/4d33366f-da71-482a-89ae-a8470e531bba'] },
  { file: 'shape-15.png', raw: ['https://www.figma.com/api/mcp/asset/6dcd41fa-f0e1-455e-8b2c-e90e76d9469c', 'https://www.figma.com/api/mcp/asset/30ffb71b-9663-4a71-b747-eff65577d6fd'] },
  { file: 'shape-13.png', raw: ['https://www.figma.com/api/mcp/asset/01d3a22c-903e-4f70-807d-d399bc6931a0', 'https://www.figma.com/api/mcp/asset/8be2d075-3ebb-4e10-987e-a6197691a148'] },
  { file: 'shape-19.png', raw: ['https://www.figma.com/api/mcp/asset/6f261c66-fd3b-4855-aae6-48b3e386950a', 'https://www.figma.com/api/mcp/asset/faa65ebd-39e7-4a5a-aea5-94e087ed1eca'] },
  { file: 'shape-20.png', raw: ['https://www.figma.com/api/mcp/asset/6e4889ff-0f3b-4513-9979-26aab6d9f200', 'https://www.figma.com/api/mcp/asset/f2f3163e-4039-4d47-b0de-f55ecc1b9f9d'] },
]

const OUT = path.join(process.cwd(), 'public/objects/process')

async function opaqueRatio(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  let opaque = 0
  for (let i = 3; i < data.length; i += 4) if (data[i] > 0) opaque++
  return opaque / (info.width * info.height)
}

async function pickBest(urls) {
  const candidates = []
  for (const url of urls) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`fetch failed ${url}`)
    const buffer = Buffer.from(await res.arrayBuffer())
    const meta = await sharp(buffer).metadata()
    const ratio = await opaqueRatio(buffer)
    candidates.push({ buffer, meta, ratio })
  }
  candidates.sort((a, b) => {
    const areaA = (a.meta.width ?? 0) * (a.meta.height ?? 0)
    const areaB = (b.meta.width ?? 0) * (b.meta.height ?? 0)
    return areaB - areaA
  })
  return candidates[0]
}

await mkdir(OUT, { recursive: true })

for (const shape of SHAPES) {
  const best = await pickBest(shape.raw)
  const outPath = path.join(OUT, shape.file)
  await sharp(best.buffer).ensureAlpha().png().toFile(outPath)
  console.log(
    shape.file,
    `${best.meta.width}x${best.meta.height}`,
    `opaque ${Math.round(best.ratio * 100)}%`
  )
}
