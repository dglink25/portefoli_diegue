'use client';

import { useState, useEffect } from 'react';
import type { Profile } from '@/types';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { id: 'about',      label: 'À propos' },
  { id: 'expertises', label: 'Expertises' },
  { id: 'skills',     label: 'Compétences' },
  { id: 'experience', label: 'Expériences' },
  { id: 'projects',   label: 'Projets' },
  { id: 'gallery',    label: 'Galerie' },
  { id: 'reviews',    label: 'Avis' },
  { id: 'contact',    label: 'Contact' },
];

export function NavBar({ profile, active, locale }: { profile: Profile | null; active: string; locale: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const initials = profile
    ? profile.full_name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'DH';

  const switchLocale = (l: string) => {
    const path = window.location.pathname;
    const segs = path.split('/');
    if (['fr','en'].includes(segs[1])) {
      segs[1] = l === 'fr' ? '' : l;
    } else if (l !== 'fr') {
      segs.unshift('', l);
    }
    window.location.href = segs.join('/').replace('//', '/') || '/';
  };

  return (
    <>
      <header
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}
        className={`transition-all duration-300 ${scrolled ? 'navbar-scrolled' : ''}`}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40, borderRadius: 8, background: 'var(--c-blue-dim)',
              color: '#fff', fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: '0.9rem',
              border: 'none', cursor: 'pointer', flexShrink: 0,
            }}
          >
            {initials}
          </button>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden md:flex">
            {LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`nav-link ${active === link.id ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 0.75rem', borderRadius: 6 }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Locale switch */}
            <div style={{ display: 'flex', gap: 4, background: 'var(--c-bg3)', borderRadius: 8, padding: 3, border: '1px solid var(--c-border)' }}>
              {['fr','en'].map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  style={{
                    padding: '3px 10px', borderRadius: 5, border: 'none',
                    cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                    background: locale === l ? 'var(--c-blue-dim)' : 'transparent',
                    color: locale === l ? '#fff' : 'var(--c-muted)',
                    transition: 'all 0.2s',
                  }}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              style={{ background: 'none', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.4rem', cursor: 'pointer', color: 'var(--c-muted)' }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          className="md:hidden"
        >
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(13,17,23,0.8)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)}
          />
          <nav
            style={{
              position: 'absolute', top: 64, left: 0, right: 0,
              background: 'var(--c-bg2)', borderBottom: '1px solid var(--c-border)',
              padding: '1rem',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}
          >
            {LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  background: active === link.id ? 'rgba(88,166,255,0.08)' : 'none',
                  border: 'none', cursor: 'pointer',
                  padding: '0.75rem 1rem', borderRadius: 8, textAlign: 'left',
                  color: active === link.id ? 'var(--c-blue)' : 'var(--c-muted)',
                  fontSize: '0.9rem', fontWeight: 500, fontFamily: 'var(--ff-body)',
                }}
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
