import { revalidatePath } from 'next/cache'

/** Bust cached pages after admin saves so the public site can pick up changes. */
export function revalidatePublicSite() {
  revalidatePath('/ar', 'layout')
  revalidatePath('/en', 'layout')
  revalidatePath('/ar')
  revalidatePath('/en')
}
