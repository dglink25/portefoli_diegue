import type { Profile } from '@/types';

const SOCIALS = [
  { label: 'LinkedIn',   href: 'https://linkedin.com/in/diegue-houndokinnou' },
  { label: 'GitHub',     href: 'https://github.com/houndokinnou' },
  { label: 'WhatsApp',   href: 'https://wa.me/22901941194' },
  { label: 'Email',      href: 'mailto:dondiegue21@gmail.com' },
];

export function SiteFooter({ profile }: { profile: Profile | null }) {
  const initials = profile
    ? profile.full_name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'DH';
  const name = profile?.full_name || 'Hotègni Diègue HOUNDOKINNOU';
  const title = profile?.title_fr || 'Développeur Full-Stack & IA · IoT';

  return (
    <footer style={{ background: '#0a0c10', borderTop: '1px solid var(--c-border)', padding: '3rem 2rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Top row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--c-blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: '1.1rem', color: '#fff', flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <p style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, color: 'var(--c-ink)', fontSize: '0.95rem' }}>{name}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--c-muted)' }}>{title}</p>
            </div>
          </div>

          {/* Social links */}
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-muted)', marginBottom: '0.75rem' }}>MES RÉSEAUX SOCIAUX</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SOCIALS.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  style={{ padding: '5px 14px', background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--c-muted)', textDecoration: 'none', transition: 'all 0.2s', fontFamily: 'var(--ff-body)' }}
                  onMouseEnter={(e) => { (e.currentTarget.style.borderColor = 'rgba(88,166,255,0.5)'; (e.currentTarget.style.color = 'var(--c-blue)'); }}
                  onMouseLeave={(e) => { (e.currentTarget.style.borderColor = 'var(--c-border)'; (e.currentTarget.style.color = 'var(--c-muted)'); }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* More projects */}
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-muted)', marginBottom: '0.75rem' }}>PLUS DE PROJETS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <a href="https://github.com/houndokinnou" target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: 'var(--c-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c-blue)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c-muted)')}>
                @houndokinnou sur GitHub →
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--c-border)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--c-muted)' }}>
            © {new Date().getFullYear()} Hotègni Diègue HOUNDOKINNOU — Tous droits réservés
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--c-muted)' }}>
            Conçu &amp; développé par Diègue Houndokinnou · Lokossa, Bénin 🇧🇯
          </p>
        </div>
      </div>
    </footer>
  );
}
