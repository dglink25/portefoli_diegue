/* Layout racine — ne sert qu'aux pages hors [locale] (ex: 404 global) */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
