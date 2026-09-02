'use client';

import type { Profile } from '@/types';

export function AboutSection({ profile }: { profile: Profile | null }) {
  if (!profile) return null;
  const bio = profile.bio_fr || '';

  return (
    <section id="about" style={{ padding: '5rem 0', borderTop: '1px solid var(--c-border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: '3rem' }}>
          <p className="sec-label">À PROPOS</p>
          <h2 className="sec-title">Qui suis-je ?</h2>
          <div className="sec-divider" />
        </div>

        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.6fr)', gap: '4rem', alignItems: 'start' }}>
          {/* Left — photo + tags scroll */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: -4, borderRadius: 16, background: 'linear-gradient(135deg, rgba(88,166,255,0.3), transparent)', zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 1, borderRadius: 14, overflow: 'hidden', background: 'var(--c-bg2)', border: '1px solid var(--c-border)', aspectRatio: '3/4', maxHeight: 340 }}>
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(88,166,255,0.08), var(--c-bg2))' }}>
                    <span style={{ fontFamily: 'var(--ff-display)', fontSize: '5rem', fontWeight: 700, color: 'rgba(88,166,255,0.2)' }}>DH</span>
                  </div>
                )}
              </div>
            </div>

            {/* Scrolling tech tags */}
            <div style={{ overflow: 'hidden', position: 'relative' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['</> Full-Stack Dev', 'IA & IoT', 'code(); une ligne à la fois', '✦ Agile', 'React · Next.js', 'Flutter · Dart', 'Python · FastAPI', 'Arduino · IoT', 'PDG · DGLINK', 'FIERI Président'].map((tag) => (
                  <span key={tag} style={{
                    display: 'inline-block', padding: '4px 10px',
                    background: 'rgba(88,166,255,0.06)', border: '1px solid rgba(88,166,255,0.2)',
                    borderRadius: 20, fontSize: '0.72rem', color: 'var(--c-accent)',
                    fontWeight: 500, whiteSpace: 'nowrap',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — bio text + formation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-ink)', marginBottom: 6 }}>{profile.full_name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--c-blue)', fontWeight: 500 }}>{profile.title_fr}</p>
            </div>

            {bio.split('\n').filter(Boolean).map((p, i) => (
              <p key={i} style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--c-muted)' }}>{p}</p>
            ))}
            {!bio && (
              <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--c-muted)' }}>
                Diplômé en Génie Électrique et Informatique (option Informatique et Télécommunications) à l&apos;INSTI-Lokossa, UNSTIM.
                Développeur Full-Stack chevronné, passionné par l&apos;Intelligence Artificielle et l&apos;Internet des Objets (IoT).
                Solides compétences managériales démontrées à travers la direction d&apos;organisations de jeunesse à l&apos;échelle nationale.
              </p>
            )}

            {/* Formation */}
            <div style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Licence Professionnelle Génie Électrique & Informatique', sub: 'INSTI-Lokossa, UNSTIM · 2023–2026' },
                { label: 'Baccalauréat Série D', sub: 'CEG 11 Bohicon · 2023' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ marginTop: 3, fontSize: '0.8rem', color: 'var(--c-blue)', flexShrink: 0 }}>🎓</span>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-ink)' }}>{item.label}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--c-muted)' }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {[
                { v: '3+', l: 'Années d\'expérience' },
                { v: '10+', l: 'Projets réalisés' },
                { v: '2', l: 'Organisations dirigées' },
              ].map((s) => (
                <div key={s.l} style={{ textAlign: 'center', background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '1rem' }}>
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
