import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from '@/components/theme-provider';
import { locales } from '@/i18n/config';
import type { Metadata } from 'next';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Diègue Houndokinnou — Portfolio',
  description: 'Développeur Full-Stack passionné par l\'IA et l\'IoT. Portfolio de Hotègni Diègue HOUNDOKINNOU.',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Active le rendu statique pour next-intl
  unstable_setRequestLocale(params.locale);

  const messages = await getMessages();
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
