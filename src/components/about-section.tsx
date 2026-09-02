'use client';

import { MapPin, Mail, Phone, GraduationCap, Award } from 'lucide-react';
import type { Profile } from '@/types';

const TAGS = [
  'Full-Stack Developer', 'IA & IoT', 'React · Next.js', 'Flutter · Dart',
  'Python · FastAPI', 'Arduino · IoT', 'PDG · DGLINK', 'FIERI Président',
  'Agile', 'Open-Source',
];

export function AboutSection({ profile }: { profile: Profile | null }) {
  if (!profile) return null;

  return (
    <section id="about" style={{ padding: '5rem 0', borderTop: '1px solid var(--c-border)', background: 'var(--c-bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div className="reveal" style={{ marginBottom: '3rem' }}>
          <p className="sec-label">À PROPOS</p>
          <h2 className="sec-title">Qui suis-je ?</h2>
          <div className="sec-divider" />
        </div>

        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.6fr)', gap: '4rem', alignItems: 'start' }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Photo */}
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '2px solid var(--c-border)', background: 'var(--c-bg3)', aspectRatio: '3/4', maxHeight: 340 }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(9,105,218,0.08), transparent)', pointerEvents: 'none', zIndex: 1 }} />
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--ff-display)', fontSize: '5rem', fontWeight: 700, color: 'var(--c-border)' }}>DH</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TAGS.map((tag) => (
                <span key={tag} className="tech-badge">{tag}</span>
              ))}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-ink)', marginBottom: 6 }}>{profile.full_name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--c-blue)', fontWeight: 600 }}>{profile.title_fr}</p>
            </div>

            {/* Contact quick */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { Icon: MapPin,  val: profile.location || 'Lokossa, Bénin',              href: null },
                { Icon: Mail,    val: profile.email || 'dondiegue21@gmail.com',           href: `mailto:${profile.email || 'dondiegue21@gmail.com'}` },
                { Icon: Phone,   val: '+229 01 94 11 94 76',                             href: 'tel:+22901941194' },
              ].map(({ Icon, val, href }) => (
                href
                  ? <a key={val} href={href} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'var(--c-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c-blue)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c-muted)')}>
                      <Icon size={15} style={{ color: 'var(--c-blue)', flexShrink: 0 }} /> {val}
                    </a>
                  : <span key={val} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'var(--c-muted)' }}>
                      <Icon size={15} style={{ color: 'var(--c-blue)', flexShrink: 0 }} /> {val}
                    </span>
              ))}
            </div>

            {/* Bio */}
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--c-muted)' }}>
              {profile.bio_fr || 'Diplômé en Génie Électrique et Informatique (option Informatique et Télécommunications) à l\'INSTI-Lokossa, UNSTIM. Développeur Full-Stack chevronné, passionné par l\'Intelligence Artificielle et l\'Internet des Objets (IoT). Solides compétences managériales démontrées à travers la direction d\'organisations de jeunesse à l\'échelle nationale.'}
            </p>

            {/* Formation */}
            <div style={{ background: 'var(--c-bg3)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                <GraduationCap size={16} style={{ color: 'var(--c-blue)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--c-muted)' }}>Formation</span>
              </div>
              {[
                { label: 'Licence Pro. — Génie Électrique & Informatique', sub: 'INSTI-Lokossa, UNSTIM · 2023–2026' },
                { label: 'Baccalauréat Série D', sub: 'CEG 11 Bohicon · 2023' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: 10, marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <Award size={13} style={{ color: 'var(--c-blue)', flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <p style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--c-ink)' }}>{item.label}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--c-muted)' }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {[{ v:'3+', l:"Années d'expérience" }, { v:'10+', l:'Projets réalisés' }, { v:'2', l:'Organisations dirigées' }].map((s) => (
                <div key={s.l} style={{ textAlign: 'center', background: 'var(--c-bg3)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '1rem' }}>
                  <p style={{ fontFamily: 'var(--ff-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--c-blue)' }}>{s.v}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--c-muted)', marginTop: 4 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
