'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Briefcase, ChevronDown } from 'lucide-react';
import type { Profile } from '@/types';
import { HeroScene } from './hero-scene';

const ROLES = [
  'Développeur Full-Stack',
  'Passionné IA & IoT',
  'Tech Entrepreneur',
  'Créateur de solutions',
];

export function HeroSection({ profile }: { profile: Profile | null }) {
  const [roleIdx, setRoleIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const cur = ROLES[roleIdx];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && typed.length < cur.length) t = setTimeout(() => setTyped(cur.slice(0, typed.length + 1)), 65);
    else if (!deleting) t = setTimeout(() => setDeleting(true), 2200);
    else if (deleting && typed.length > 0) t = setTimeout(() => setTyped(typed.slice(0, -1)), 38);
    else { setDeleting(false); setRoleIdx((i) => (i + 1) % ROLES.length); }
    return () => clearTimeout(t);
  }, [typed, deleting, roleIdx]);

  const name  = profile?.full_name || 'Hotègni Diègue HOUNDOKINNOU';
  const title = profile?.title_fr  || 'Développeur Full-Stack & IA · IoT';
  const bio   = profile?.bio_fr    || 'Diplômé en Génie Électrique et Informatique à l\'INSTI-Lokossa. Passionné par l\'IA et l\'IoT, je conçois des applications web/mobiles modernes et des solutions innovantes. Président du Bureau National de la FIERI et PDG de DGLINK.';

  return (
    <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, overflow: 'hidden', background: 'var(--c-bg)' }}>
      <HeroScene />
      {/* Light mode: subtle overlay; dark mode: stronger */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--c-bg) 0%, color-mix(in srgb, var(--c-bg) 85%, transparent) 60%, transparent 100%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'center' }}>
        {/* LEFT */}
        <div>
          {/* Badge */}
          <div className="anim-fade-up-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(9,105,218,0.08)', border: '1px solid rgba(9,105,218,0.25)', borderRadius: 20, padding: '6px 14px', marginBottom: '1.25rem' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--c-blue)', display: 'inline-block', animation: 'pulse-glow 2s infinite' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--c-blue)' }}>BONJOUR, JE SUIS</span>
          </div>

          {/* Name */}
          <h1 className="anim-fade-up-2" style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.9rem, 4vw, 3.2rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '0.5rem', color: 'var(--c-ink)' }}>
            {name.split(' ').slice(0, 2).join(' ')}<br />
            <span className="grad-text">{name.split(' ').slice(2).join(' ')}</span>
          </h1>

          {/* Typewriter */}
          <div className="anim-fade-up-3" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: '1.25rem', minHeight: '2rem' }}>
            <span style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)', fontWeight: 500, color: 'var(--c-muted)' }}>{typed}</span>
            <span className="cursor-blink" style={{ fontSize: '1.1rem', color: 'var(--c-blue)' }}>|</span>
          </div>

          {/* Bio */}
          <p className="anim-fade-up-3" style={{ fontSize: '0.93rem', lineHeight: 1.75, color: 'var(--c-muted)', maxWidth: 560, marginBottom: '2rem' }}>{bio}</p>

          {/* CTAs */}
          <div className="anim-fade-up-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
            <button className="btn-primary" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              Voir mes projets
            </button>
            <button className="btn-outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              <Mail size={15} /> Me contacter
            </button>
          </div>

          {/* Contact info */}
          <div className="anim-fade-up-5" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              { Icon: Mail,    text: profile?.email || 'dondiegue21@gmail.com', href: `mailto:${profile?.email || 'dondiegue21@gmail.com'}` },
              { Icon: Phone,   text: '+229 01 94 11 94 76',                    href: 'tel:+22901941194' },
              { Icon: MapPin,  text: profile?.location || 'Lokossa, Bénin',    href: null },
              { Icon: Briefcase, text: 'Présentiel / Télétravail',              href: null },
            ].map(({ Icon, text, href }) => (
              href
                ? <a key={text} href={href} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--c-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c-blue)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c-muted)')}>
                    <Icon size={14} style={{ color: 'var(--c-blue)', flexShrink: 0 }} /> {text}
                  </a>
                : <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--c-muted)' }}>
                    <Icon size={14} style={{ color: 'var(--c-blue)', flexShrink: 0 }} /> {text}
                  </span>
            ))}
          </div>

          {/* Stats */}
          <div className="anim-fade-up-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: '2rem', justifyContent: 'start' }}>
            {[
              { v: '3+',  l: "Années d'expérience" },
              { v: '10+', l: 'Projets livrés' },
              { v: '15+', l: 'Technologies' },
              { v: '2',   l: 'Organisations' },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 700, color: 'var(--c-blue)', lineHeight: 1 }}>{s.v}</p>
                <p style={{ fontSize: '0.68rem', color: 'var(--c-muted)', marginTop: 4, maxWidth: 75 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Photo */}
        <div className="anim-fade-up-3 anim-float hidden lg:block" style={{ flexShrink: 0 }}>
          <div style={{ position: 'relative', width: 270, height: 270 }}>
            <div className="anim-spin-slow" style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1.5px dashed var(--c-border)' }} />
            <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: '1px solid var(--c-border)', opacity: 0.5 }} />
            <div className="anim-pulse-glow" style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--c-blue)', background: 'var(--c-bg3)' }}>
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} /> // eslint-disable-line @next/next/no-img-element
                : <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--c-bg3)' }}>
                    <span style={{ fontFamily: 'var(--ff-display)', fontSize: '3.5rem', fontWeight: 700, color: 'var(--c-border)' }}>DH</span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--c-muted)', marginTop: 8, textAlign: 'center', padding: '0 1rem' }}>Ajoutez votre photo via l&apos;admin</span>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, animation: 'float 2s ease-in-out infinite' }}>
        <span style={{ fontSize: '0.62rem', color: 'var(--c-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Défiler</span>
        <ChevronDown size={18} style={{ color: 'var(--c-muted)' }} />
      </div>
    </section>
  );
}
