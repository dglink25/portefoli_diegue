import { Github, Linkedin, Twitter, Mail, MessageCircle, Globe, Instagram, Facebook } from 'lucide-react';
import type { Profile } from '@/types';
import type { LucideIcon } from 'lucide-react';

const SOCIAL_CONFIG: { key: string; label: string; Icon: LucideIcon }[] = [
  { key: 'linkedin',  label: 'LinkedIn',   Icon: Linkedin },
  { key: 'github',    label: 'GitHub',     Icon: Github },
  { key: 'twitter',   label: 'Twitter',    Icon: Twitter },
  { key: 'whatsapp',  label: 'WhatsApp',   Icon: MessageCircle },
  { key: 'instagram', label: 'Instagram',  Icon: Instagram },
  { key: 'facebook',  label: 'Facebook',   Icon: Facebook },
  { key: 'website',   label: 'Site web',   Icon: Globe },
  { key: 'email',     label: 'Email',      Icon: Mail },
];

export function SiteFooter({ profile }: { profile: Profile | null }) {
  const initials = profile
    ? profile.full_name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'DH';
  const name    = profile?.full_name || 'Hotègni Diègue HOUNDOKINNOU';
  const title   = profile?.title_fr  || 'Développeur Full-Stack & IA · IoT';
  const social  = (profile?.social_links ?? {}) as Record<string, string>;
  const email   = profile?.email || 'dondiegue21@gmail.com';

  /* Construit la liste des réseaux à afficher depuis social_links du profil */
  const activeSocials = SOCIAL_CONFIG
    .map(({ key, label, Icon }) => {
      const href = key === 'email'
        ? (social[key] ? `mailto:${social[key]}` : `mailto:${email}`)
        : social[key];
      return href ? { label, Icon, href } : null;
    })
    .filter(Boolean) as { label: string; Icon: LucideIcon; href: string }[];

  /* Fallback si aucun réseau configuré */
  const fallback = [
    { label: 'GitHub',   Icon: Github,   href: 'https://github.com/houndokinnou' },
    { label: 'LinkedIn', Icon: Linkedin, href: 'https://linkedin.com' },
    { label: 'Email',    Icon: Mail,     href: `mailto:${email}` },
  ];
  const displayed = activeSocials.length > 0 ? activeSocials : fallback;

  return (
    <footer style={{ borderTop: '1px solid var(--c-border)', background: 'var(--c-bg2)', padding: '3rem 2rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Top */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2.5rem', marginBottom: '2.5rem' }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--c-blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: '1rem', color: '#fff', flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <p style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, color: 'var(--c-ink)', fontSize: '0.95rem' }}>{name}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--c-muted)' }}>{title}</p>
            </div>
          </div>

          {/* Réseaux sociaux — depuis social_links du profil */}
          <div>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--c-muted)', marginBottom: '0.75rem' }}>
              Réseaux sociaux
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {displayed.map(({ label, href, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" title={label}
                  style={{ width: 36, height: 36, background: 'var(--c-bg3)', border: '1px solid var(--c-border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-muted)', textDecoration: 'none', transition: 'all .2s' }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--c-blue)'; el.style.color = 'var(--c-blue)'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--c-border)'; el.style.color = 'var(--c-muted)'; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* GitHub */}
          <div>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--c-muted)', marginBottom: '0.75rem' }}>
              Projets open-source
            </p>
            <a href={social.github || 'https://github.com/houndokinnou'} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--c-muted)', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c-blue)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c-muted)')}>
              <Github size={14} /> @houndokinnou sur GitHub
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid var(--c-border)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.76rem', color: 'var(--c-muted)' }}>
            &copy; {new Date().getFullYear()} Hotègni Diègue HOUNDOKINNOU &mdash; Tous droits réservés
          </p>
          <p style={{ fontSize: '0.76rem', color: 'var(--c-muted)' }}>
            Conçu &amp; développé avec Next.js &middot; Lokossa, Bénin
          </p>
        </div>
      </div>
    </footer>
  );
}
