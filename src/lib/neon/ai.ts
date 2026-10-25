import 'server-only'
import { neon } from '@neon/ai-sdk-provider'
import { generateText } from 'ai'

// Neon AI Gateway through the Vercel AI SDK. @neon/ai-sdk-provider reads NEON_AI_GATEWAY_BASE_URL and
// NEON_AI_GATEWAY_TOKEN, which `neon deploy` writes once `aiGateway: true` is enabled in neon.ts.
// The gateway is a paid-plan feature: on the Free plan these vars are absent and every helper reports "not configured".
export const AI_DEFAULT_MODEL = process.env.NEON_AI_MODEL || 'claude-haiku-4-5'

export const isAiGatewayConfigured = () =>
  !!process.env.NEON_AI_GATEWAY_BASE_URL && !!process.env.NEON_AI_GATEWAY_TOKEN

export async function aiComplete(prompt: string, model = AI_DEFAULT_MODEL) {
  if (!isAiGatewayConfigured()) {
    throw new Error('Neon AI Gateway is not configured (enable aiGateway in neon.ts on a paid plan, then `neon deploy`)')
  }
  const { text, usage } = await generateText({ model: neon(model), prompt })
  return { text, usage, model }
}

/** Live model list from the branch gateway (only served on the unified /v1 dialect). */
export async function aiListModels() {
  if (!isAiGatewayConfigured()) return []
  const res = await fetch(`${process.env.NEON_AI_GATEWAY_BASE_URL}/v1/models`, {
    headers: { Authorization: `Bearer ${process.env.NEON_AI_GATEWAY_TOKEN}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`AI Gateway /v1/models ${res.status}`)
  const json = (await res.json()) as { data: { id: string; enabled: boolean }[] }
  return json.data.filter((m) => m.enabled).map((m) => m.id)
}
