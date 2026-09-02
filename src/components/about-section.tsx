'use client';

import { MapPin, Mail, Phone, GraduationCap, Award } from 'lucide-react';
import type { Profile } from '@/types';

const TAGS_FR = ['Full-Stack Developer', 'IA & IoT', 'React · Next.js', 'Flutter · Dart', 'Python · FastAPI', 'Arduino · IoT', 'PDG · DGLINK', 'FIERI Président', 'Agile'];
const TAGS_EN = ['Full-Stack Developer', 'AI & IoT', 'React · Next.js', 'Flutter · Dart', 'Python · FastAPI', 'Arduino · IoT', 'CEO · DGLINK', 'FIERI President', 'Agile'];

export function AboutSection({ profile, locale }: { profile: Profile | null; locale: string }) {
  if (!profile) return null;

  const title = locale === 'en' ? profile.title_en : profile.title_fr;
  const bio   = locale === 'en' ? profile.bio_en   : profile.bio_fr;
  const TAGS  = locale === 'en' ? TAGS_EN : TAGS_FR;

  const FORMATION = locale === 'en'
    ? [
        { label: 'Professional Degree — Electrical & Computer Engineering', sub: 'INSTI-Lokossa, UNSTIM · 2023–2026' },
        { label: 'High School Diploma (Series D)', sub: 'CEG 11 Bohicon · 2023' },
      ]
    : [
        { label: 'Licence Pro. — Génie Électrique & Informatique', sub: 'INSTI-Lokossa, UNSTIM · 2023–2026' },
        { label: 'Baccalauréat Série D', sub: 'CEG 11 Bohicon · 2023' },
      ];

  const STATS = locale === 'en'
    ? [{ v:'3+', l:"Years' experience" }, { v:'10+', l:'Projects done' }, { v:'2', l:'Organisations led' }]
    : [{ v:'3+', l:"Années d'expérience" }, { v:'10+', l:'Projets réalisés' }, { v:'2', l:'Organisations dirigées' }];

  return (
    <section id="about" style={{ padding: '3.5rem 1.25rem', borderTop: '1px solid var(--c-border)', background: 'var(--c-bg)' }}
      className="md:sec-pad">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" style={{ marginBottom: '2.5rem' }}>
          <p className="sec-label">{locale === 'en' ? 'ABOUT' : 'À PROPOS'}</p>
          <h2 className="sec-title">{locale === 'en' ? 'Who am I?' : 'Qui suis-je ?'}</h2>
          <div className="sec-divider" />
        </div>

        {/* Responsive grid */}
        <div className="reveal about-grid">
          {/* Left — photo + tags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '2px solid var(--c-border)', background: 'var(--c-bg3)', aspectRatio: '3/4', maxHeight: 320 }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(9,105,218,0.06), transparent)', pointerEvents: 'none', zIndex: 1 }} />
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} /> // eslint-disable-line
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--ff-display)', fontSize: '5rem', fontWeight: 700, color: 'var(--c-border)' }}>DH</span>
                  </div>
              }
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TAGS.map((tag) => <span key={tag} className="tech-badge">{tag}</span>)}
            </div>
          </div>

          {/* Right — bio + formation + stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--c-ink)', marginBottom: 6 }}>{profile.full_name}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--c-blue)', fontWeight: 600 }}>{title}</p>
            </div>

            {/* Contacts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { Icon: MapPin, val: profile.location || 'Lokossa, Bénin', href: null },
                { Icon: Mail,   val: profile.email   || 'dondiegue21@gmail.com', href: `mailto:${profile.email || 'dondiegue21@gmail.com'}` },
                { Icon: Phone,  val: '+229 01 94 11 94 76', href: 'tel:+22901941194' },
              ].map(({ Icon, val, href }) => (
                href
                  ? <a key={val} href={href} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.83rem', color: 'var(--c-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c-blue)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c-muted)')}>
                      <Icon size={14} style={{ color: 'var(--c-blue)', flexShrink: 0 }} /> {val}
                    </a>
                  : <span key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.83rem', color: 'var(--c-muted)' }}>
                      <Icon size={14} style={{ color: 'var(--c-blue)', flexShrink: 0 }} /> {val}
                    </span>
              ))}
            </div>

            {/* Bio */}
            <p style={{ fontSize: '0.93rem', lineHeight: 1.8, color: 'var(--c-muted)' }}>
              {bio || (locale === 'en'
                ? 'Graduate in Electrical Engineering and Computer Science from INSTI-Lokossa, UNSTIM. Full-Stack developer passionate about Artificial Intelligence and IoT.'
                : 'Diplômé en Génie Électrique et Informatique à l\'INSTI-Lokossa, UNSTIM. Développeur Full-Stack passionné par l\'IA et l\'IoT.')}
            </p>

            {/* Formation */}
            <div style={{ background: 'var(--c-bg3)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                <GraduationCap size={15} style={{ color: 'var(--c-blue)' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--c-muted)' }}>
                  {locale === 'en' ? 'Education' : 'Formation'}
                </span>
              </div>
              {FORMATION.map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: 10, marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <Award size={12} style={{ color: 'var(--c-blue)', flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--c-ink)' }}>{item.label}</p>
                    <p style={{ fontSize: '0.74rem', color: 'var(--c-muted)' }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="about-stats">
              {STATS.map((s) => (
                <div key={s.l} style={{ textAlign: 'center', background: 'var(--c-bg3)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '0.875rem' }}>
                  <p style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--c-blue)' }}>{s.v}</p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--c-muted)', marginTop: 3 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
