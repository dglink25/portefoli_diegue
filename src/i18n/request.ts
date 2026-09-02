import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ locale }) => {
  const active = locales.includes(locale as any) ? locale : defaultLocale;
  return {
    messages: (await import(`./messages/${active}.json`)).default
  };
});
