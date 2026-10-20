'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { Profile } from '@/types';

function getLinks(locale: string) {
  return locale === 'en'
    ? [
        { id: 'about', label: 'About' },
        { id: 'expertises', label: 'Expertise' },
        { id: 'skills', label: 'Skills' },
        { id: 'experience', label: 'Experience' },
        { id: 'projects', label: 'Projects' },
        { id: 'gallery', label: 'Gallery' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'contact', label: 'Contact' },
      ]
    : [
        { id: 'about', label: 'À propos' },
        { id: 'expertises', label: 'Expertises' },
        { id: 'skills', label: 'Compétences' },
        { id: 'experience', label: 'Expériences' },
        { id: 'projects', label: 'Projets' },
        { id: 'gallery', label: 'Galerie' },
        { id: 'reviews', label: 'Avis' },
        { id: 'contact', label: 'Contact' },
      ];
}

function ThemeBtn({ locale }: { locale: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ width: '2.75rem', height: '2.75rem' }} />;
  const dark = resolvedTheme === 'dark';
  const label =
    locale === 'en' ? (dark ? 'Light theme' : 'Dark theme') : dark ? 'Thème clair' : 'Thème sombre';
  return (
    <button type="button" className="icon-btn" aria-label={label} title={label} onClick={() => setTheme(dark ? 'light' : 'dark')}>
      {dark ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  );
}

export function NavBar({ profile, active, locale }: { profile: Profile | null; active: string; locale: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const LINKS = getLinks(locale);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    h();
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const switchLocale = (next: string) => {
    if (next === locale) return;
    const real = window.location.pathname;
    const withoutPrefix = real.replace(/^\/(en|fr)(\/|$)/, '/') || '/';
    window.location.href = `/${next}${withoutPrefix === '/' ? '' : withoutPrefix}`;
  };

  const initials = profile
    ? profile.full_name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'DH';

  return (
    <>
      <header
        className={scrolled || mobileOpen ? 'navbar-scrolled' : ''}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled || mobileOpen ? undefined : 'var(--c-bg)' }}
      >
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, gap: 12 }}>
          <button
            type="button"
            onClick={() => scrollTo('hero')}
            aria-label={locale === 'en' ? 'Back to top' : 'Retour en haut'}
            style={{ width: '2.75rem', height: '2.75rem', borderRadius: 6, background: 'var(--c-blue-dim)', color: '#fff', fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: '1.05rem', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          >
            {initials}
          </button>

          <nav className="nav-links" aria-label={locale === 'en' ? 'Main navigation' : 'Navigation principale'}>
            {LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                className={`nav-link ${active === link.id ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--ff-body)', whiteSpace: 'nowrap' }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            <div role="group" aria-label={locale === 'en' ? 'Language' : 'Langue'} style={{ display: 'flex', border: '1px solid var(--c-border)', borderRadius: 6, overflow: 'hidden', background: 'var(--c-bg2)' }}>
              {(['fr', 'en'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => switchLocale(l)}
                  aria-pressed={locale === l}
                  style={{ minWidth: '2.75rem', height: '2.75rem', border: 'none', cursor: locale === l ? 'default' : 'pointer', fontSize: '.95rem', fontWeight: 700, textTransform: 'uppercase', background: locale === l ? 'var(--c-blue-dim)' : 'transparent', color: locale === l ? '#fff' : 'var(--c-ink)', fontFamily: 'var(--ff-body)' }}
                >
                  {l}
                </button>
              ))}
            </div>
            <ThemeBtn locale={locale} />
            <button
              type="button"
              className="nav-burger icon-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? (locale === 'en' ? 'Close menu' : 'Fermer le menu') : locale === 'en' ? 'Open menu' : 'Ouvrir le menu'}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,27,42,.55)' }} onClick={() => setMobileOpen(false)} />
          <nav
            aria-label={locale === 'en' ? 'Menu' : 'Menu'}
            style={{ position: 'absolute', top: 72, left: 0, right: 0, background: 'var(--c-bg2)', borderBottom: '1px solid var(--c-border)', padding: '.5rem 1.25rem 1rem', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 72px)', overflowY: 'auto' }}
          >
            {LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                style={{ background: 'none', border: 'none', borderBottom: '1px solid var(--c-border)', cursor: 'pointer', padding: '1rem .25rem', textAlign: 'left', color: active === link.id ? 'var(--c-blue)' : 'var(--c-ink)', fontSize: '1.15rem', fontWeight: active === link.id ? 700 : 500, fontFamily: 'var(--ff-body)', minHeight: '3.25rem' }}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}