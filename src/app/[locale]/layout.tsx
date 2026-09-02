import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { Metadata } from 'next';
import '../globals.css';

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
  const messages = await getMessages();
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
