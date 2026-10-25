import { aiComplete, isAiGatewayConfigured } from '@/lib/neon/ai'

// Minimal completion endpoint through the Neon AI Gateway (paid plan). Returns 503 until the gateway is enabled.
export async function POST(request: Request) {
  if (!isAiGatewayConfigured()) {
    return Response.json(
      { error: 'Neon AI Gateway is not configured: it is not served on the Free plan. Enable aiGateway in neon.ts after upgrading, then run `neon deploy`.' },
      { status: 503 },
    )
  }
  const { prompt } = (await request.json().catch(() => ({}))) as { prompt?: string }
  if (!prompt) return Response.json({ error: 'prompt is required' }, { status: 400 })
  const result = await aiComplete(prompt.slice(0, 2000))
  return Response.json(result, { headers: { 'Cache-Control': 'no-store' } })
}
