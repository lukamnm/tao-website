import { notFound } from 'next/navigation'

// Every unknown public URL ends here and renders the locale's 404 page.
export default function CatchAll() {
  notFound()
}
