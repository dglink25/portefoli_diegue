'use client';

import { useState } from 'react';
import type { Project } from '@/types';
import { X, ExternalLink, Github } from 'lucide-react';

export function ProjectsSection({ projects, locale }: { projects: Project[]; locale: string }) {
  const [panel, setPanel] = useState<Project | null>(null);

  return (
    <section id="projects" style={{ padding: '5rem 0', borderTop: '1px solid var(--c-border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div className="reveal" style={{ marginBottom: '3rem' }}>
          <p className="sec-label">PROJETS</p>
          <h2 className="sec-title">Réalisations</h2>
          <div className="sec-divider" />
          <p style={{ fontSize: '0.9rem', color: 'var(--c-muted)' }}>Une sélection de projets web, mobile et IA réalisés.</p>
        </div>

        {projects.length === 0 ? (
          <div className="reveal" style={{ border: '2px dashed var(--c-border)', borderRadius: 14, padding: '4rem 2rem', textAlign: 'center', color: 'var(--c-muted)', fontSize: '0.9rem' }}>
            <p style={{ marginBottom: 8 }}>Aucun projet publié pour le moment.</p>
            <p>Ajoutez vos projets via <strong>/admin/projects</strong></p>
          </div>
        ) : (
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {projects.map((p, idx) => {
              const title = locale === 'fr' ? p.title_fr : p.title_en;
              const desc  = locale === 'fr' ? p.description_fr : p.description_en;
              const shown = p.tags.slice(0, 3);
              const extra = p.tags.length - 3;
              return (
                <article key={p.id} className="proj-card" onClick={() => setPanel(p)}>
                  <div className="proj-num">{String(idx + 1).padStart(2, '0')}</div>

                  {/* Cover */}
                  <div style={{ height: 180, overflow: 'hidden', background: 'linear-gradient(135deg, rgba(88,166,255,0.12), var(--c-bg3))', position: 'relative' }}>
                    {p.cover_image
                      ? <img src={p.cover_image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} // eslint-disable-next-line @next/next/no-img-element
                          onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = 'scale(1.05)'; }}
                          onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'scale(1)'; }}
                        />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'var(--ff-display)', fontSize: '4rem', fontWeight: 700, color: 'rgba(88,166,255,0.15)' }}>{title.charAt(0)}</span>
                        </div>
                    }
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,17,23,0.8), transparent)' }} />
                  </div>

                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--c-ink)', marginBottom: 6, transition: 'color 0.2s' }}>{title}</h3>

                    {p.tags.length > 0 && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--c-muted)', marginBottom: '0.75rem' }}>
                        {p.tags.length} tech{p.tags.length > 1 ? 's' : ''}
                      </p>
                    )}

                    <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--c-muted)', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{desc}</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
                      {shown.map((t) => <span key={t} className="tech-badge">{t}</span>)}
                      {extra > 0 && <span style={{ fontSize: '0.7rem', color: 'var(--c-muted)', padding: '2px 6px', background: 'var(--c-bg3)', borderRadius: 5 }}>+{extra}</span>}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); setPanel(p); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-blue)', fontSize: '0.8rem', fontWeight: 600, padding: 0, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--ff-body)' }}
                    >
                      En savoir plus <span>→</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Slide-in panel (right side) */}
      {panel && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          {/* Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }} onClick={() => setPanel(null)} />
          {/* Panel */}
          <div
            className="panel-slide-in"
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0, width: 'min(520px, 100vw)',
              background: 'var(--c-bg2)', borderLeft: '1px solid var(--c-border)',
              overflowY: 'auto', padding: '2rem',
              display: 'flex', flexDirection: 'column', gap: '1.5rem',
            }}
          >
            {/* Close */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--c-blue)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {panel.tags.length} technologie{panel.tags.length > 1 ? 's' : ''}
              </span>
              <button onClick={() => setPanel(null)}
                style={{ background: 'var(--c-bg3)', border: '1px solid var(--c-border)', borderRadius: 8, padding: '0.4rem 0.6rem', cursor: 'pointer', color: 'var(--c-muted)', display: 'flex', alignItems: 'center' }}>
                <X size={18} />
              </button>
            </div>

            {/* Cover */}
            {panel.cover_image && (
              <div style={{ borderRadius: 12, overflow: 'hidden', height: 200 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={panel.cover_image} alt={locale === 'fr' ? panel.title_fr : panel.title_en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            {/* Title */}
            <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--c-ink)' }}>
              {locale === 'fr' ? panel.title_fr : panel.title_en}
            </h2>

            {/* Description */}
            <div>
              <h4 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>📋</span> Description
              </h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--c-muted)' }}>
                {locale === 'fr' ? panel.description_fr : panel.description_en}
              </p>
            </div>

            {/* Tech tags */}
            {panel.tags.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🛠️</span> Technologies & outils
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {panel.tags.map((t) => <span key={t} className="tech-badge">{t}</span>)}
                </div>
              </div>
            )}

            {/* Links */}
            {(panel.demo_url || panel.repo_url) && (
              <div>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🔗</span> Liens
                </h4>
                <div style={{ display: 'flex', gap: 12 }}>
                  {panel.demo_url && (
                    <a href={panel.demo_url} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.82rem' }}>
                      <ExternalLink size={14} /> Voir le projet
                    </a>
                  )}
                  {panel.repo_url && (
                    <a href={panel.repo_url} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '0.6rem 1.2rem', fontSize: '0.82rem' }}>
                      <Github size={14} /> Code source
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
