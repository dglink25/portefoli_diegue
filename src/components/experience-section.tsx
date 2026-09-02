import { Briefcase, MapPin } from 'lucide-react';
import type { Experience } from '@/types';

function fmt(d: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short' }).format(new Date(d));
}

export function ExperienceSection({ experiences, locale }: { experiences: Experience[]; locale: string }) {
  if (experiences.length === 0) return null;

  return (
    <section id="experience" style={{ padding: '5rem 0', borderTop: '1px solid var(--c-border)', background: 'var(--c-bg3)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div className="reveal" style={{ marginBottom: '3rem' }}>
          <p className="sec-label">EXPÉRIENCES</p>
          <h2 className="sec-title">Parcours professionnel</h2>
          <div className="sec-divider" />
          <p style={{ fontSize: '0.9rem', color: 'var(--c-muted)' }}>Stages, formations et postes de leadership.</p>
        </div>

        <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
          <div className="timeline-line" />
          <ol style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', listStyle: 'none' }}>
            {experiences.map((exp, idx) => {
              const title = locale === 'fr' ? exp.title_fr : exp.title_en;
              const desc  = locale === 'fr' ? exp.description_fr : exp.description_en;
              return (
                <li key={exp.id} className="reveal" style={{ position: 'relative', transitionDelay: `${idx * 70}ms` }}>
                  <div className="timeline-dot">
                    <Briefcase size={14} strokeWidth={2} />
                  </div>
                  <div style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 14, padding: '1.5rem', transition: 'all 0.25s' }}
                    onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--c-blue)'; el.style.boxShadow = '0 4px 20px var(--c-shadow)'; }}
                    onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--c-border)'; el.style.boxShadow = 'none'; }}
                  >
                    {/* Date + Location */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.76rem', color: 'var(--c-blue)', fontWeight: 600, background: 'rgba(9,105,218,0.08)', border: '1px solid rgba(9,105,218,0.2)', borderRadius: 20, padding: '2px 10px' }}>
                        {fmt(exp.start_date, locale)} — {exp.end_date ? fmt(exp.end_date, locale) : 'Aujourd\'hui'}
                      </span>
                      {exp.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', color: 'var(--c-muted)' }}>
                          <MapPin size={12} /> {exp.location}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--c-ink)', marginBottom: 4 }}>{exp.company}</h3>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--c-blue)', marginBottom: desc ? '0.75rem' : 0 }}>{title}</h4>
                    {desc && <p style={{ fontSize: '0.84rem', lineHeight: 1.7, color: 'var(--c-muted)' }}>{desc}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
