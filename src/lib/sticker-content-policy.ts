export type StickerModerationResult =
  | { allowed: true }
  | { allowed: false; message: string }

const REJECTED_MESSAGE =
  "That description isn't allowed. Please try something wholesome and family-friendly."

const VERIFY_FAILED_MESSAGE =
  'Could not verify this description. Try something else.'

type OpenAIModerationResponse = {
  results?: Array<{
    flagged?: boolean
    categories?: Record<string, boolean>
  }>
}

export async function moderateStickerPrompt(
  apiKey: string,
  text: string
): Promise<StickerModerationResult> {
  try {
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: text }),
    })

    if (!response.ok) {
      return { allowed: false, message: VERIFY_FAILED_MESSAGE }
    }

    const payload = (await response.json()) as OpenAIModerationResponse
    const result = payload.results?.[0]

    if (result?.flagged) {
      return { allowed: false, message: REJECTED_MESSAGE }
    }

    return { allowed: true }
  } catch {
    return { allowed: false, message: VERIFY_FAILED_MESSAGE }
  }
}

export function isImageGenerationPolicyError(
  payload: { error?: { message?: string; code?: string; type?: string } },
  status: number
) {
  const code = payload.error?.code?.toLowerCase() ?? ''
  const type = payload.error?.type?.toLowerCase() ?? ''
  const message = payload.error?.message?.toLowerCase() ?? ''

  return (
    status === 400 &&
    (code.includes('content_policy') ||
      code.includes('safety') ||
      type.includes('content_policy') ||
      type.includes('safety') ||
      message.includes('safety system') ||
      message.includes('content policy') ||
      message.includes('not allowed'))
  )
}

export function imageGenerationPolicyMessage() {
  return REJECTED_MESSAGE
}
