'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales } from '@/i18n/config';

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: string) {
    const segments = pathname.split('/');
    const hasLocalePrefix = locales.includes(segments[1] as any);
    if (hasLocalePrefix) segments[1] = next;
    const nextPath = hasLocalePrefix ? segments.join('/') : `/${next}${pathname}`;
    router.push(next === 'fr' ? nextPath.replace('/fr', '') || '/' : nextPath);
  }

  return (
    <div className="flex items-center gap-1 rounded-md border border-border-light p-1 text-xs font-medium dark:border-border-dark">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-current={locale === l}
          className={`rounded px-2 py-1 uppercase transition-colors ${
            locale === l
              ? 'bg-primary text-white'
              : 'text-muted-light hover:text-ink-light dark:text-muted-dark dark:hover:text-ink-dark'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
