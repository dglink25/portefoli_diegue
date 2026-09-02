'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Mail, Phone, GraduationCap, Award, X } from 'lucide-react';
import type { Profile } from '@/types';
import type { Stat } from '@/app/[locale]/page';

/* ── Count-up hook ── */
function useCountUp(target: number, duration = 1800, trigger: boolean) {
  const [count, setCount] = useState(0);
  const [popping, setPopping] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(ease * target);
      setCount(current);
      if (progress < 1) {
        frame.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
        setPopping(true);
        setTimeout(() => setPopping(false), 400);
      }
    };
    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration, trigger]);

  return { count, popping };
}

/* ── Single stat with count-up ── */
function StatCard({ stat, trigger, locale }: { stat: Stat; trigger: boolean; locale: string }) {
  const { count, popping } = useCountUp(stat.value, 1600, trigger);
  const label = locale === 'en' ? stat.label_en : stat.label_fr;

  return (
    <div className="reveal-bounce shimmer-card"
      style={{ textAlign: 'center', background: 'var(--c-bg3)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '1rem .75rem', transition: 'border-color .25s, box-shadow .25s' }}
      onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = 'var(--c-blue)'; el.style.boxShadow = '0 4px 16px var(--c-shadow)'; }}
      onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = 'var(--c-border)'; el.style.boxShadow = 'none'; }}>
      <p style={{ fontFamily: 'var(--ff-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--c-blue)', lineHeight: 1 }}>
        <span className={`stat-count${popping ? ' pop' : ''}`}>{count}</span>
        <span style={{ fontSize: '1.1rem' }}>{stat.suffix}</span>
      </p>
      <p style={{ fontSize: '.68rem', color: 'var(--c-muted)', marginTop: 5, lineHeight: 1.3 }}>{label}</p>
    </div>
  );
}

const TAGS_FR = ['Full-Stack Dev', 'IA & IoT', 'React · Next.js', 'Flutter', 'Python · FastAPI', 'Arduino', 'PDG · DGLINK', 'FIERI Président', 'Agile'];
const TAGS_EN = ['Full-Stack Dev', 'AI & IoT', 'React · Next.js', 'Flutter', 'Python · FastAPI', 'Arduino', 'CEO · DGLINK', 'FIERI President', 'Agile'];

export function AboutSection({ profile, locale, stats }: { profile: Profile | null; locale: string; stats: Stat[] }) {
  if (!profile) return null;

  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  /* Déclenche le count-up quand la section entre dans le viewport */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Reveal variés au scroll */
  useEffect(() => {
    const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-blur,.reveal-bounce,.reveal-rotate');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const title = locale === 'en' ? profile.title_en : profile.title_fr;
  const bio   = locale === 'en' ? profile.bio_en   : profile.bio_fr;
  const TAGS  = locale === 'en' ? TAGS_EN : TAGS_FR;

  const FORMATION = locale === 'en'
    ? [{ label: 'Professional Degree — Electrical & Computer Engineering', sub: 'INSTI-Lokossa, UNSTIM · 2023–2026' },
       { label: 'High School Diploma (Series D)', sub: 'CEG 11 Bohicon · 2023' }]
    : [{ label: 'Licence Pro. — Génie Électrique & Informatique', sub: 'INSTI-Lokossa, UNSTIM · 2023–2026' },
       { label: 'Baccalauréat Série D', sub: 'CEG 11 Bohicon · 2023' }];

  return (
    <section id="about" ref={sectionRef} className="sec-pad" style={{ borderTop: '1px solid var(--c-border)', background: 'var(--c-bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header — slide depuis la gauche */}
        <div className="reveal-left" style={{ marginBottom: '2.5rem' }}>
          <p className="sec-label">{locale === 'en' ? 'ABOUT' : 'À PROPOS'}</p>
          <h2 className="sec-title">{locale === 'en' ? 'Who am I?' : 'Qui suis-je ?'}</h2>
          <div className="animated-line" style={{ width: '3rem', marginTop: '.75rem', marginBottom: 0 }} />
        </div>

        <div className="about-grid">
          {/* Left — photo cliquable + tags */}
          <div className="reveal-scale" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Photo cliquable */}
            <div
              className="photo-zoom"
              onClick={() => profile.avatar_url && setLightbox(true)}
              title={profile.avatar_url ? (locale === 'en' ? 'Click to enlarge' : 'Cliquer pour agrandir') : ''}
              style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '2px solid var(--c-border)', background: 'var(--c-bg3)', aspectRatio: '3/4', maxHeight: 340 }}>

              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(9,105,218,.06),transparent)', pointerEvents: 'none', zIndex: 1 }} />

              {/* Badge zoom */}
              {profile.avatar_url && (
                <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 2, background: 'rgba(9,105,218,.85)', borderRadius: 6, padding: '3px 8px', fontSize: '.65rem', fontWeight: 600, color: '#fff', backdropFilter: 'blur(4px)' }}>
                  {locale === 'en' ? 'Click to zoom' : 'Cliquer pour agrandir'}
                </div>
              )}

              {profile.avatar_url
                ? <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} /> // eslint-disable-line
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--ff-display)', fontSize: '5rem', fontWeight: 700, color: 'var(--c-border)' }}>DH</span>
                  </div>
              }
            </div>

            {/* Tags — rotate in avec stagger */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TAGS.map((tag, i) => (
                <span key={tag} className={`tech-badge glow-badge reveal-rotate stagger-${Math.min(i + 1, 8)}`} style={{ cursor: 'default' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — bio + formation + stats */}
          <div className="reveal-right" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--c-ink)', marginBottom: 6 }}>{profile.full_name}</h3>
              <p style={{ fontSize: '.88rem', color: 'var(--c-blue)', fontWeight: 600 }}>{title}</p>
            </div>

            {/* Contacts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { Icon: MapPin, val: profile.location || 'Lokossa, Bénin', href: null },
                { Icon: Mail,   val: profile.email   || 'dondiegue21@gmail.com', href: `mailto:${profile.email || 'dondiegue21@gmail.com'}` },
                { Icon: Phone,  val: '+229 01 94 11 94 76', href: 'tel:+22901941194' },
              ].map(({ Icon, val, href }) => (
                href
                  ? <a key={val} href={href} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.83rem', color: 'var(--c-muted)', textDecoration: 'none', transition: 'color .2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c-blue)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c-muted)')}>
                      <Icon size={14} style={{ color: 'var(--c-blue)', flexShrink: 0 }} /> {val}
                    </a>
                  : <span key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.83rem', color: 'var(--c-muted)' }}>
                      <Icon size={14} style={{ color: 'var(--c-blue)', flexShrink: 0 }} /> {val}
                    </span>
              ))}
            </div>

            {/* Bio */}
            <p style={{ fontSize: '.93rem', lineHeight: 1.8, color: 'var(--c-muted)' }}>
              {bio || (locale === 'en'
                ? 'Graduate in Electrical Engineering and Computer Science from INSTI-Lokossa. Full-Stack developer passionate about AI and IoT.'
                : 'Diplômé en Génie Électrique et Informatique à l\'INSTI-Lokossa. Développeur Full-Stack passionné par l\'IA et l\'IoT.')}
            </p>

            {/* Formation — blur in */}
            <div className="reveal-blur" style={{ background: 'var(--c-bg3)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                <GraduationCap size={15} style={{ color: 'var(--c-blue)' }} />
                <span style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--c-muted)' }}>
                  {locale === 'en' ? 'Education' : 'Formation'}
                </span>
              </div>
              {FORMATION.map((item, i) => (
                <div key={item.label} className={`reveal stagger-${i + 1}`} style={{ display: 'flex', gap: 10, marginBottom: '.75rem', alignItems: 'flex-start' }}>
                  <Award size={12} style={{ color: 'var(--c-blue)', flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <p style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--c-ink)' }}>{item.label}</p>
                    <p style={{ fontSize: '.74rem', color: 'var(--c-muted)' }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats — count-up au scroll + bounce in */}
            <div className="about-stats">
              {stats.map((s, i) => (
                <div key={s.label_fr} className={`stagger-${i + 1}`}>
                  <StatCard stat={s} trigger={triggered} locale={locale} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox photo plein écran */}
      {lightbox && profile.avatar_url && (
        <div
          onClick={() => setLightbox(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <button onClick={() => setLightbox(false)}
            style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 16, objectFit: 'contain', boxShadow: '0 24px 80px rgba(0,0,0,.6)', animation: 'scaleIn .25s ease both' }}
          />
        </div>
      )}
    </section>
  );
}
