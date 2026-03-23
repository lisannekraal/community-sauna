import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

const validLocales = ['en', 'nl'];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get('NEXT_LOCALE')?.value ?? 'nl';
  const locale = validLocales.includes(raw) ? raw : 'nl';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
