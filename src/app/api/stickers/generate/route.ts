import { NextResponse } from 'next/server'
import { buildStickerPrompt } from '@/lib/build-sticker-prompt'
import { isStickerGenerateMockEnabled, mockGenerateSticker } from '@/lib/mock-sticker-generate'
import { generateOpenAIImage } from '@/lib/openai-image-generate'
import {
  imageGenerationPolicyMessage,
  isImageGenerationPolicyError,
  moderateStickerPrompt,
} from '@/lib/sticker-content-policy'

const MAX_PROMPT_LENGTH = 280
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 12

const hits = new Map<string, { count: number; resetAt: number }>()

function getClientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function checkRateLimit(ip: string) {
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) return false

  entry.count += 1
  return true
}

function friendlyOpenAIError(
  payload: { error?: { message?: string; code?: string } },
  status: number
) {
  const code = payload.error?.code
  const message = payload.error?.message

  if (code === 'billing_hard_limit_reached') {
    return 'OpenAI billing limit reached. Add credits or raise your spending limit at platform.openai.com.'
  }

  if (message) return message

  if (status === 401) return 'Invalid OpenAI API key.'
  if (status === 403) return 'This API key does not have access to image generation.'
  if (status === 429) return 'OpenAI rate limit hit. Wait a moment and try again.'

  return 'Sticker generation failed. Try again.'
}

export async function POST(req: Request) {
  const useMock = isStickerGenerateMockEnabled()
  const apiKey = process.env.OPENAI_API_KEY

  if (!useMock && !apiKey) {
    return NextResponse.json(
      { error: 'Sticker generation is not configured.' },
      { status: 503 }
    )
  }

  const ip = getClientIp(req)
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many sticker requests. Try again later.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const prompt =
    typeof body === 'object' &&
    body !== null &&
    'prompt' in body &&
    typeof (body as { prompt: unknown }).prompt === 'string'
      ? (body as { prompt: string }).prompt.trim()
      : ''

  if (!prompt) {
    return NextResponse.json({ error: 'Describe the sticker you want.' }, { status: 400 })
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json(
      { error: `Keep your description under ${MAX_PROMPT_LENGTH} characters.` },
      { status: 400 }
    )
  }

  if (useMock) {
    return NextResponse.json(await mockGenerateSticker(prompt))
  }

  const moderation = await moderateStickerPrompt(apiKey!, prompt)
  if (!moderation.allowed) {
    return NextResponse.json({ error: moderation.message }, { status: 400 })
  }

  let result: Awaited<ReturnType<typeof generateOpenAIImage>>
  try {
    result = await generateOpenAIImage(apiKey!, {
      model: 'gpt-image-1',
      prompt: buildStickerPrompt(prompt),
      size: '1024x1024',
      quality: 'medium',
      output_format: 'png',
      background: 'transparent',
      n: 1,
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'FETCH_FAILED') {
      return NextResponse.json(
        {
          error:
            'Could not reach OpenAI. Check your internet connection and API key, then restart the dev server.',
        },
        { status: 502 }
      )
    }
    throw err
  }

  const { ok, status, payload } = result

  if (!ok) {
    if (isImageGenerationPolicyError(payload, status)) {
      return NextResponse.json({ error: imageGenerationPolicyMessage() }, { status: 400 })
    }

    return NextResponse.json(
      { error: friendlyOpenAIError(payload, status) },
      { status: 502 }
    )
  }

  const b64 = payload.data?.[0]?.b64_json
  if (!b64) {
    return NextResponse.json(
      { error: 'No image was returned. Try a different description.' },
      { status: 502 }
    )
  }

  return NextResponse.json({
    id: `ai-${Date.now()}`,
    label: prompt,
    src: `data:image/png;base64,${b64}`,
  })
}
