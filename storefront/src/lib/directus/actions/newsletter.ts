'use server';

import { createNewsletterEntry } from '../api/entries';

export async function subscribeNewsletter(_currentState: unknown, formData: FormData) {
  const email = formData.get('email') as string;

  try {
    await createNewsletterEntry({ email });
    return { message: 'success' };
  } catch (error: any) {
    const errorCode = (error?.errors?.[0] as any)?.extensions?.code as string;
    if (errorCode) {
      return { message: errorCode };
    }
    return { message: 'error' };
  }
}
