'use client';

import { useEffect, useState } from 'react';
import type { Profile } from '@/types';
import { HeroScene } from './hero-scene';

const ROLES = ['Développeur Full-Stack', 'Passionné IA & IoT', 'Tech Entrepreneur', 'Créateur de solutions'];

export function HeroSection({ profile }: { profile: Profile | null }) {
  const [roleIdx, setRoleIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const cur = ROLES[roleIdx];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && typed.length < cur.length) t = setTimeout(() => setTyped(cur.slice(0, typed.length + 1)), 65);
    else if (!deleting && typed.length === cur.length) t = setTimeout(() => setDeleting(true), 2200);
    else if (deleting && typed.length > 0) t = setTimeout(() => setTyped(typed.slice(0, -1)), 38);
    else { setDeleting(false); setRoleIdx((i) => (i + 1) % ROLES.length); }
    return () => clearTimeout(t);
  }, [typed, deleting, roleIdx]);

  const name = profile?.full_name || 'Hotègni Diègue HOUNDOKINNOU';
  const title = profile?.title_fr || 'Développeur Full-Stack & IA · IoT';
  const bio = profile?.bio_fr || 'Diplômé en Génie Électrique et Informatique à l\'INSTI-Lokossa. Passionné par l\'IA et l\'IoT, je conçois des applications web/mobiles modernes et des solutions innovantes. Président du Bureau National de la FIERI et PDG de DGLINK.';

  return (
    <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, overflow: 'hidden' }}>
      {/* Three.js bg */}
      <HeroScene />
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,17,23,0.97) 0%, rgba(13,17,23,0.7) 60%, rgba(13,17,23,0.3) 100%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'center' }}>
        {/* LEFT */}
        <div>
          {/* Badge */}
          <div className="anim-fade-up-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(88,166,255,0.08)', border: '1px solid rgba(88,166,255,0.25)', borderRadius: 20, padding: '6px 14px', marginBottom: '1.25rem' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--c-blue)', display: 'inline-block', animation: 'pulse-glow 2s infinite' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-blue)' }}>BONJOUR, JE SUIS</span>
          </div>

          {/* Name */}
          <h1 className="anim-fade-up-2" style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '0.5rem', color: 'var(--c-ink)' }}>
            {name.split(' ').slice(0, 2).join(' ')}<br />
            <span className="grad-text">{name.split(' ').slice(2).join(' ')}</span>
          </h1>

          {/* Typewriter */}
          <div className="anim-fade-up-3" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: '1.25rem', minHeight: '2rem' }}>
            <span style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)', fontWeight: 500, color: 'var(--c-muted)' }}>{typed}</span>
            <span className="cursor-blink" style={{ fontSize: '1.2rem', color: 'var(--c-blue)', marginLeft: 1 }}>|</span>
          </div>

          {/* Bio */}
          <p className="anim-fade-up-3" style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--c-muted)', maxWidth: 580, marginBottom: '2rem' }}>
            {bio}
          </p>

          {/* CTA buttons */}
          <div className="anim-fade-up-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <button className="btn-primary" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              Voir mes projets
            </button>
            <a href="mailto:dondiegue21@gmail.com" className="btn-outline">
              Télécharger mon CV
            </a>
          </div>

          {/* Contact quick */}
          <div className="anim-fade-up-5" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              { icon: '✉️', text: profile?.email || 'dondiegue21@gmail.com', href: `mailto:${profile?.email || 'dondiegue21@gmail.com'}` },
              { icon: '📞', text: '+229 01 94 11 94 76', href: 'tel:+22901941194' },
              { icon: '📍', text: profile?.location || 'Lokossa, Bénin', href: null },
              { icon: '💼', text: 'Présentiel / Télétravail', href: null },
            ].map(({ icon, text, href }) => (
              href
                ? <a key={text} href={href} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--c-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c-blue)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c-muted)')}>
                    <span>{icon}</span><span>{text}</span>
                  </a>
                : <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--c-muted)' }}>
                    <span>{icon}</span><span>{text}</span>
                  </span>
            ))}
          </div>

          {/* Stats */}
          <div className="anim-fade-up-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: '2rem', justifyContent: 'start' }}>
            {[
              { v: '3+', l: 'Années d\'expérience' },
              { v: '10+', l: 'Projets livrés' },
              { v: '15+', l: 'Technologies maîtrisées' },
              { v: '2', l: 'Organisations dirigées' },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--c-blue)', lineHeight: 1 }}>{s.v}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--c-muted)', marginTop: 4, maxWidth: 80 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Photo */}
        <div className="anim-fade-up-3 anim-float hidden lg:block" style={{ flexShrink: 0 }}>
          <div style={{ position: 'relative', width: 280, height: 280 }}>
            {/* Spinning ring */}
            <div className="anim-spin-slow" style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '2px dashed rgba(88,166,255,0.3)' }} />
            <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: '1px solid rgba(88,166,255,0.1)' }} />
            {/* Glow */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(88,166,255,0.2), transparent 70%)', pointerEvents: 'none' }} />
            {/* Photo */}
            <div
              className="anim-pulse-glow"
              style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(88,166,255,0.4)', background: 'var(--c-bg2)' }}
            >
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(88,166,255,0.1), var(--c-bg2))' }}>
                  <span style={{ fontFamily: 'var(--ff-display)', fontSize: '4rem', fontWeight: 700, color: 'rgba(88,166,255,0.3)' }}>DH</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--c-muted)', marginTop: 8, textAlign: 'center', padding: '0 1rem' }}>Ajoutez votre photo via l&apos;admin</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, animation: 'float 2s ease-in-out infinite' }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--c-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Défiler</span>
        <div style={{ width: 24, height: 36, border: '2px solid var(--c-border)', borderRadius: 12, display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
          <div style={{ width: 4, height: 8, background: 'var(--c-blue)', borderRadius: 2, animation: 'fadeUp 1.5s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  );
}
