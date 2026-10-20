'use client';

import { Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import type { Profile } from '@/types';

export function HeroSection({ profile, locale }: { profile: Profile | null; locale: string }) {
  const en = locale === 'en';

  const name = profile?.full_name || 'Hotègni Diègue HOUNDOKINNOU';
  const title = en
    ? profile?.title_en || 'Electrical and Computer Engineer'
    : profile?.title_fr || 'Ingénieur en génie électrique et informatique';
  const bio = en
    ? profile?.bio_en ||
      'Graduate in Electrical Engineering and Computer Science from INSTI-Lokossa. I design web and mobile applications and IoT solutions.'
    : profile?.bio_fr ||
      "Diplômé en Génie Électrique et Informatique à l'INSTI-Lokossa. Je conçois des applications web et mobiles et des solutions IoT.";
  const email = profile?.email || 'dondiegue21@gmail.com';
  const photo = profile?.hero_image_url || profile?.avatar_url || null;

  const infos = [
    { Icon: Mail, text: email, href: `mailto:${email}` },
    { Icon: Phone, text: '+229 01 94 11 94 76', href: 'tel:+22901941194' },
    { Icon: MapPin, text: profile?.location || 'Lokossa, Bénin', href: null },
    { Icon: Briefcase, text: en ? 'On-site or remote' : 'Présentiel ou télétravail', href: null },
  ];

  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" style={{ background: 'var(--c-bg)' }}>
      <div className="hero-grid" style={{ paddingTop: '7.5rem' }}>
        <div>
          <p className="anim-fade-up-1 sec-label">{en ? 'Portfolio' : 'Portfolio'}</p>

          <h1
            className="anim-fade-up-2"
            style={{ fontSize: 'clamp(2.25rem, 5.5vw, 3.75rem)', fontWeight: 600, lineHeight: 1.1, color: 'var(--c-ink)' }}
          >
            {name}
          </h1>

          <p
            className="anim-fade-up-3"
            style={{ marginTop: '1rem', fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.25rem, 2.6vw, 1.7rem)', color: 'var(--c-blue)', fontWeight: 500 }}
          >
            {title}
          </p>

          <p className="anim-fade-up-3" style={{ marginTop: '1.5rem', fontSize: '1.15rem', lineHeight: 1.75, color: 'var(--c-muted)' }}>
            {bio}
          </p>

          <div className="anim-fade-up-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn-primary" onClick={() => goTo('projects')}>
              {en ? 'View my projects' : 'Voir mes projets'}
            </button>
            <button type="button" className="btn-outline" onClick={() => goTo('contact')}>
              <Mail size={20} aria-hidden /> {en ? 'Contact me' : 'Me contacter'}
            </button>
          </div>

          <ul
            className="anim-fade-up-5"
            style={{ listStyle: 'none', marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '.75rem' }}
          >
            {infos.map(({ Icon, text, href }) => (
              <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '1.05rem', maxWidth: 'none' }}>
                <Icon size={22} aria-hidden style={{ color: 'var(--c-blue)', flexShrink: 0 }} />
                {href ? (
                  <a href={href} className="link-quiet" style={{ color: 'var(--c-ink)', overflowWrap: 'anywhere' }}>
                    {text}
                  </a>
                ) : (
                  <span style={{ color: 'var(--c-ink)' }}>{text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-photo anim-fade-up-3">
          <div style={{ aspectRatio: '4 / 5', border: '1px solid var(--c-border)', borderRadius: 6, overflow: 'hidden', background: 'var(--c-bg3)' }}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ff-display)', fontSize: '4rem', fontWeight: 600, color: 'var(--c-border)' }}>
                DH
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}