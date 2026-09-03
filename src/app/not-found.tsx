import { Search, Home, ArrowLeft } from 'lucide-react';
import './globals.css';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--c-bg, #f6f8fa)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>

        {/* Numéro 404 stylisé */}
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(7rem, 20vw, 10rem)',
            fontWeight: 900,
            color: 'var(--c-bg3, #f0f2f5)',
            lineHeight: 1,
            userSelect: 'none',
            letterSpacing: '-0.05em',
            margin: 0,
          }}>
            404
          </p>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(9,105,218,.1)',
            border: '2px solid rgba(9,105,218,.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Search size={32} strokeWidth={1.5} style={{ color: 'var(--c-blue, #0969da)' }} />
          </div>
        </div>

        {/* Titre */}
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 700,
          color: 'var(--c-ink, #1c2128)',
          marginBottom: '.75rem',
        }}>
          Page introuvable
        </h1>

        <p style={{
          fontSize: '.95rem',
          color: 'var(--c-muted, #57606a)',
          lineHeight: 1.7,
          maxWidth: 400,
          margin: '0 auto 2.5rem',
        }}>
          La page que vous cherchez a peut-être été déplacée, renommée ou n&apos;existe tout simplement pas.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
          <a href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '.8rem 1.75rem', borderRadius: 10,
            background: 'var(--c-blue-dim, #0550ae)', color: '#fff',
            textDecoration: 'none', fontSize: '.875rem', fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
          }}>
            <Home size={16} /> Retour à l&apos;accueil
          </a>
          <a href="javascript:history.back()" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '.8rem 1.75rem', borderRadius: 10,
            border: '1px solid var(--c-border, #d0d7de)',
            background: 'transparent',
            color: 'var(--c-ink, #1c2128)',
            textDecoration: 'none', fontSize: '.875rem', fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
          }}>
            <ArrowLeft size={16} /> Page précédente
          </a>
        </div>

        {/* Liens rapides */}
        <div style={{ borderTop: '1px solid var(--c-border, #d0d7de)', paddingTop: '2rem' }}>
          <p style={{
            fontSize: '.75rem', color: 'var(--c-muted, #57606a)',
            marginBottom: '1rem', textTransform: 'uppercase',
            letterSpacing: '.1em', fontWeight: 700,
          }}>
            Pages populaires
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', justifyContent: 'center' }}>
            {[
              { href: '/#about',      label: 'À propos' },
              { href: '/#projects',   label: 'Projets' },
              { href: '/#skills',     label: 'Compétences' },
              { href: '/#contact',    label: 'Contact' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{
                padding: '.4rem .875rem', borderRadius: 20,
                border: '1px solid var(--c-border, #d0d7de)',
                background: 'var(--c-bg2, #fff)',
                color: 'var(--c-muted, #57606a)',
                textDecoration: 'none', fontSize: '.78rem', fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
              }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
