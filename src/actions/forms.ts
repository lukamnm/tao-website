'use server'
import { getPayload } from '@/lib/payload'

/* Server actions for the public forms. Validation messages are Georgian source strings (translated in the UI). */

export type FormResult = { ok: true; name: string } | { ok: false; errors: Record<string, string> }

const digits = (s: string) => s.replace(/\D/g, '')
const get = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim()

export async function submitContact(fd: FormData): Promise<FormResult> {
  const name = get(fd, 'name')
  const phone = get(fd, 'phone')
  const email = get(fd, 'email')
  const message = get(fd, 'message')
  const topic = get(fd, 'topic') || 'general'
  const consent = get(fd, 'consent') === '1'
  const locale = get(fd, 'locale') || 'ka'
  const errors: Record<string, string> = {}
  if (!name) errors.name = 'მიუთითე სახელი'
  if (digits(phone).length < 9) errors.phone = 'მიუთითე სწორი ნომერი'
  if (!message) errors.msg = 'დაწერე შეტყობინება'
  if (!consent) errors.consent = '1'
  if (message.length > 5000) errors.msg = 'შეტყობინება ძალიან გრძელია'
  if (Object.keys(errors).length) return { ok: false, errors }
  const payload = await getPayload()
  await payload.create({
    collection: 'contact-messages',
    data: { name, phone, email: email || undefined, message, topic: topic as 'general' | 'buy' | 'claim' | 'complaint', consent, locale, status: 'new' },
  })
  return { ok: true, name: name.split(' ')[0] }
}
