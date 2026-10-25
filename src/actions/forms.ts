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

export async function submitLead(fd: FormData): Promise<FormResult> {
  const firstName = get(fd, 'first')
  const lastName = get(fd, 'last')
  const company = get(fd, 'company')
  const code = digits(get(fd, 'code'))
  const staff = Number(digits(get(fd, 'staff')))
  const phone = get(fd, 'phone')
  const consent = get(fd, 'consent') === '1'
  const locale = get(fd, 'locale') || 'ka'
  const errors: Record<string, string> = {}
  if (!firstName) errors.first = 'მიუთითე სახელი'
  if (!lastName) errors.last = 'მიუთითე გვარი'
  if (!company) errors.company = 'მიუთითე კომპანიის დასახელება'
  if (code.length !== 9 && code.length !== 11) errors.code = 'მიუთითე სწორი საიდენტიფიკაციო ნომერი'
  if (!(staff > 0)) errors.staff = 'მიუთითე თანამშრომლების რაოდენობა'
  if (digits(phone).length < 9) errors.phone = 'მიუთითე სწორი ნომერი'
  if (!consent) errors.consent = '1'
  if (Object.keys(errors).length) return { ok: false, errors }
  const payload = await getPayload()
  await payload.create({
    collection: 'corporate-requests',
    data: { firstName, lastName, company, companyCode: code, staff, phone, consent, locale, status: 'new' },
  })
  return { ok: true, name: firstName }
}
