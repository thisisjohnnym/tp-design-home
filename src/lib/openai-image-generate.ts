type ImageGenerateBody = {
  model: string
  prompt: string
  size: string
  quality: string
  output_format: string
  background: string
  n: number
}

type ImageGenerateResult = {
  data?: Array<{ b64_json?: string }>
  error?: { message?: string; code?: string; type?: string }
}

export async function generateOpenAIImage(
  apiKey: string,
  body: ImageGenerateBody
): Promise<{ ok: boolean; status: number; payload: ImageGenerateResult }> {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const payload = (await response.json()) as ImageGenerateResult
    return { ok: response.ok, status: response.status, payload }
  } catch {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('FETCH_FAILED')
    }

    return generateOpenAIImageViaCurl(apiKey, body)
  }
}

async function generateOpenAIImageViaCurl(
  apiKey: string,
  body: ImageGenerateBody
): Promise<{ ok: boolean; status: number; payload: ImageGenerateResult }> {
  const { execFile } = await import('node:child_process')
  const { promisify } = await import('node:util')
  const execFileAsync = promisify(execFile)

  try {
    const { stdout } = await execFileAsync(
      'curl',
      [
        '-sS',
        '-w',
        '\n__HTTP_STATUS__:%{http_code}',
        'https://api.openai.com/v1/images/generations',
        '-H',
        `Authorization: Bearer ${apiKey}`,
        '-H',
        'Content-Type: application/json',
        '-d',
        JSON.stringify(body),
      ],
      { maxBuffer: 20 * 1024 * 1024 }
    )

    const raw = String(stdout)
    const marker = '\n__HTTP_STATUS__:'
    const markerIndex = raw.lastIndexOf(marker)
    const jsonText = markerIndex === -1 ? raw : raw.slice(0, markerIndex)
    const status = markerIndex === -1 ? 502 : Number(raw.slice(markerIndex + marker.length))

    const payload = JSON.parse(jsonText) as ImageGenerateResult
    return { ok: status >= 200 && status < 300, status, payload }
  } catch {
    throw new Error('FETCH_FAILED')
  }
}
