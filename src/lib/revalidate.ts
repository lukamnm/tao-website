import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/* Admin changes show on the site at once: every change clears the cached pages. */
async function clear() {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    /* outside Next (seed scripts) */
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await clear()
  return doc
}
export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await clear()
  return doc
}
export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc }) => {
  await clear()
  return doc
}
export const contentHooks = { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] }
