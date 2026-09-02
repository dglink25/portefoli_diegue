import { ThemeProvider } from '@/components/theme-provider';
import { AuthSessionProvider } from '@/components/session-provider';
import '../globals.css';

export const metadata = {
  title: 'Backoffice — Portfolio'
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
