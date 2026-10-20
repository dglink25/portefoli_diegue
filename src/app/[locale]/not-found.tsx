'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

const QUICK_LINKS = [
  { href: '/#about', label: 'À propos' },
  { href: '/#projects', label: 'Projets' },
  { href: '/#skills', label: 'Compétences' },
  { href: '/#contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--c-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.25rem',
      }}
    >
      <div style={{ maxWidth: 560, width: '100%' }}>
        <p
          className="anim-fade-up-1"
          style={{
            fontFamily: 'var(--ff-display)',
            fontSize: 'clamp(5rem, 18vw, 8rem)',
            fontWeight: 700,
            color: 'var(--c-blue)',
            lineHeight: 1,
          }}
        >
          404
        </p>

        <h1
          className="anim-fade-up-2"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--c-ink)', marginTop: '1rem' }}
        >
          Page introuvable
        </h1>
        <p
          className="anim-fade-up-3"
          style={{ fontSize: '1.1rem', color: 'var(--c-muted)', marginTop: '.75rem' }}
        >
          L&apos;adresse saisie n&apos;existe pas ou a été déplacée. Retournez à l&apos;accueil ou
          utilisez l&apos;un des liens ci-dessous.
        </p>

        <div
          className="anim-fade-up-4"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}
        >
          <Link href="/" className="btn-primary">
            <Home size={20} aria-hidden /> Retour à l&apos;accueil
          </Link>
          <button type="button" onClick={() => history.back()} className="btn-outline">
            <ArrowLeft size={20} aria-hidden /> Page précédente
          </button>
        </div>

        <nav
          aria-label="Sections du site"
          className="anim-fade-up-5"
          style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--c-border)' }}
        >
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--c-ink)', marginBottom: '1rem' }}>
            Aller directement à
          </p>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', listStyle: 'none' }}>
            {QUICK_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="tech-badge" style={{ fontSize: '1rem', padding: '.5rem 1rem', textDecoration: 'none' }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}