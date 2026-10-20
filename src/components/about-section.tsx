'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Mail, Phone, GraduationCap, X } from 'lucide-react';
import type { Profile } from '@/types';
import type { Stat } from '@/app/[locale]/page';

function useCountUp(target: number, trigger: boolean, duration = 1400) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, trigger, duration]);
  return count;
}

function StatCard({ stat, trigger, locale }: { stat: Stat; trigger: boolean; locale: string }) {
  const count = useCountUp(stat.value, trigger);
  return (
    <div className="card" style={{ padding: '1.25rem 1rem' }}>
      <p style={{ fontFamily: 'var(--ff-display)', fontSize: '2.25rem', fontWeight: 600, color: 'var(--c-blue)', lineHeight: 1 }}>
        <span className="stat-count">{count}</span>
        {stat.suffix}
      </p>
      <p style={{ fontSize: '1rem', color: 'var(--c-muted)', marginTop: '.5rem', lineHeight: 1.35 }}>
        {locale === 'en' ? stat.label_en : stat.label_fr}
      </p>
    </div>
  );
}

const TAGS_FR = ['Développement full-stack', 'IA et IoT', 'React, Next.js', 'Flutter', 'Python, FastAPI', 'Arduino', 'Gestion de projets agile'];
const TAGS_EN = ['Full-stack development', 'AI and IoT', 'React, Next.js', 'Flutter', 'Python, FastAPI', 'Arduino', 'Agile project management'];

export function AboutSection({ profile, locale, stats }: { profile: Profile | null; locale: string; stats: Stat[] }) {
  const en = locale === 'en';
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!profile) return null;

  const title = en ? profile.title_en : profile.title_fr;
  const bio = en ? profile.bio_en : profile.bio_fr;
  const email = profile.email || 'dondiegue21@gmail.com';
  const tags = en ? TAGS_EN : TAGS_FR;

  const formation = en
    ? [
        { label: 'Professional degree, Electrical and Computer Engineering', sub: 'INSTI-Lokossa, UNSTIM · 2023–2026' },
        { label: 'High school diploma (Series D)', sub: 'CEG 11 Bohicon · 2023' },
      ]
    : [
        { label: 'Licence professionnelle, Génie électrique et informatique', sub: 'INSTI-Lokossa, UNSTIM · 2023–2026' },
        { label: 'Baccalauréat série D', sub: 'CEG 11 Bohicon · 2023' },
      ];

  const contacts = [
    { Icon: MapPin, val: profile.location || 'Lokossa, Bénin', href: null },
    { Icon: Mail, val: email, href: `mailto:${email}` },
    { Icon: Phone, val: '+229 01 94 11 94 76', href: 'tel:+22901941194' },
  ];

  return (
    <section id="about" ref={sectionRef} style={{ borderTop: '1px solid var(--c-border)', background: 'var(--c-bg2)' }}>
      <div className="sec-pad">
        <div className="reveal" style={{ marginBottom: '2.5rem' }}>
          <p className="sec-label">{en ? 'About' : 'À propos'}</p>
          <h2 className="sec-title">{en ? 'Profile' : 'Profil'}</h2>
          <div className="sec-divider" style={{ marginBottom: 0 }} />
        </div>

        <div className="about-grid">
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <button
              type="button"
              onClick={() => profile.avatar_url && setLightbox(true)}
              aria-label={en ? 'Enlarge photo' : 'Agrandir la photo'}
              disabled={!profile.avatar_url}
              style={{ padding: 0, border: '1px solid var(--c-border)', borderRadius: 6, overflow: 'hidden', background: 'var(--c-bg3)', aspectRatio: '4 / 5', width: '100%', maxWidth: 380, cursor: profile.avatar_url ? 'zoom-in' : 'default' }}
            >
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              ) : (
                <span style={{ fontFamily: 'var(--ff-display)', fontSize: '4rem', color: 'var(--c-border)' }}>DH</span>
              )}
            </button>

            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '.75rem' }}>{en ? 'Areas' : 'Domaines'}</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                {tags.map((tag) => (
                  <li key={tag} className="tech-badge" style={{ fontSize: '.95rem', padding: '.35rem .75rem', maxWidth: 'none' }}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '.25rem' }}>{profile.full_name}</h3>
              {title && <p style={{ fontSize: '1.15rem', color: 'var(--c-blue)', fontWeight: 600 }}>{title}</p>}
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {contacts.map(({ Icon, val, href }) => (
                <li key={val} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '1.05rem', maxWidth: 'none' }}>
                  <Icon size={22} aria-hidden style={{ color: 'var(--c-blue)', flexShrink: 0 }} />
                  {href ? (
                    <a href={href} className="link-quiet" style={{ color: 'var(--c-ink)', overflowWrap: 'anywhere' }}>{val}</a>
                  ) : (
                    <span style={{ color: 'var(--c-ink)' }}>{val}</span>
                  )}
                </li>
              ))}
            </ul>

            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--c-muted)' }}>
              {bio ||
                (en
                  ? 'Graduate in Electrical Engineering and Computer Science from INSTI-Lokossa.'
                  : "Diplômé en Génie Électrique et Informatique à l'INSTI-Lokossa.")}
            </p>

            <div className="card">
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1rem' }}>
                <GraduationCap size={24} aria-hidden style={{ color: 'var(--c-blue)' }} />
                {en ? 'Education' : 'Formation'}
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {formation.map((item) => (
                  <li key={item.label} style={{ maxWidth: 'none' }}>
                    <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--c-ink)' }}>{item.label}</p>
                    <p style={{ fontSize: '1rem', color: 'var(--c-muted)' }}>{item.sub}</p>
                  </li>
                ))}
              </ul>
            </div>

            {stats.length > 0 && (
              <div className="about-stats">
                {stats.map((s) => (
                  <StatCard key={s.label_fr} stat={s} trigger={triggered} locale={locale} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {lightbox && profile.avatar_url && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(8,14,22,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label={en ? 'Close' : 'Fermer'}
            className="icon-btn"
            style={{ position: 'absolute', top: 16, right: 16 }}
          >
            <X size={24} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '92vw', maxHeight: '88vh', borderRadius: 6, objectFit: 'contain', animation: 'scaleIn .25s ease both' }}
          />
        </div>
      )}
    </section>
  );
}