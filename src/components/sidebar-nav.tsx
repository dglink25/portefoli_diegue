'use client';

import { useState } from 'react';
import {
  Home, User, Wrench, FolderKanban, Briefcase, Images,
  Star, Mail, Github, Linkedin, Globe, Menu, X, Sun, Moon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Profile } from '@/types';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

const NAV: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: 'hero',       label: 'Accueil',      Icon: Home },
  { id: 'about',      label: 'À propos',     Icon: User },
  { id: 'skills',     label: 'Compétences',  Icon: Wrench },
  { id: 'projects',   label: 'Projets',      Icon: FolderKanban },
  { id: 'experience', label: 'Parcours',     Icon: Briefcase },
  { id: 'gallery',    label: 'Galerie',      Icon: Images },
  { id: 'reviews',    label: 'Avis',         Icon: Star },
  { id: 'contact',    label: 'Contact',      Icon: Mail },
];

function ThemeBtn() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ width: 32, height: 32 }} />;
  const dark = resolvedTheme === 'dark';
  return (
    <button onClick={() => setTheme(dark ? 'light' : 'dark')} title={dark ? 'Thème clair' : 'Thème sombre'}
      style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--c-border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-muted)', transition: 'all 0.2s' }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--c-blue)'; el.style.color = 'var(--c-blue)'; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--c-border)'; el.style.color = 'var(--c-muted)'; }}>
      {dark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}

export function SidebarNav({ profile, activeSection, locale }: {
  profile: Profile | null;
  activeSection: string;
  locale: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const social = profile?.social_links || {};

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const switchLocale = (l: string) => {
    const segs = window.location.pathname.split('/');
    if (['fr','en'].includes(segs[1])) segs[1] = l === 'fr' ? '' : l;
    else if (l !== 'fr') segs.unshift('', l);
    window.location.href = segs.join('/').replace('//', '/') || '/';
  };

  const NavContent = () => (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      {/* Profile */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid var(--c-border)', padding: '2rem 1.5rem' }}>
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <div className="anim-pulse-glow" style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--c-blue)', background: 'var(--c-bg3)' }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> // eslint-disable-line
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--c-blue)' }}>
                  {(profile?.full_name || 'D').charAt(0)}
                </div>
            }
          </div>
          <div style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: '50%', background: '#2ea043', border: '2px solid var(--c-bg2)' }} title="Disponible" />
        </div>
        <p style={{ textAlign: 'center', fontFamily: 'var(--ff-display)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--c-ink)', lineHeight: 1.3, marginBottom: 4 }}>
          {profile?.full_name || 'Hotègni Diègue HOUNDOKINNOU'}
        </p>
        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--c-blue)', fontWeight: 500, marginBottom: '1rem' }}>
          {profile?.title_fr || 'Développeur Full-Stack & IA'}
        </p>

        {/* Social icons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(social as any).github && (
            <a href={(social as any).github} target="_blank" rel="noreferrer"
              style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-muted)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--c-blue)'; el.style.color = 'var(--c-blue)'; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--c-border)'; el.style.color = 'var(--c-muted)'; }}>
              <Github size={13} />
            </a>
          )}
          {(social as any).linkedin && (
            <a href={(social as any).linkedin} target="_blank" rel="noreferrer"
              style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-muted)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--c-blue)'; el.style.color = 'var(--c-blue)'; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--c-border)'; el.style.color = 'var(--c-muted)'; }}>
              <Linkedin size={13} />
            </a>
          )}
          <a href={`mailto:${profile?.email || 'dondiegue21@gmail.com'}`}
            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-muted)', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--c-blue)'; el.style.color = 'var(--c-blue)'; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--c-border)'; el.style.color = 'var(--c-muted)'; }}>
            <Mail size={13} />
          </a>
          {(social as any).website && (
            <a href={(social as any).website} target="_blank" rel="noreferrer"
              style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-muted)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--c-blue)'; el.style.color = 'var(--c-blue)'; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--c-border)'; el.style.color = 'var(--c-muted)'; }}>
              <Globe size={13} />
            </a>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ id, label, Icon }) => {
            const isActive = activeSection === id;
            return (
              <li key={id}>
                <button onClick={() => scrollTo(id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '0.6rem 0.75rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: isActive ? 'rgba(9,105,218,0.1)' : 'transparent',
                  color: isActive ? 'var(--c-blue)' : 'var(--c-muted)',
                  fontSize: '0.84rem', fontWeight: isActive ? 600 : 500,
                  fontFamily: 'var(--ff-body)', transition: 'all 0.2s', textAlign: 'left',
                }}
                  onMouseEnter={(e) => { if (!isActive) { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--c-bg3)'; el.style.color = 'var(--c-ink)'; } }}
                  onMouseLeave={(e) => { if (!isActive) { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'var(--c-muted)'; } }}
                >
                  <Icon size={15} strokeWidth={isActive ? 2 : 1.75} />
                  {label}
                  {isActive && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--c-blue)' }} />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid var(--c-border)', padding: '1rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.75rem' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#2ea043', flexShrink: 0 }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--c-muted)' }}>Disponible pour missions</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--c-bg3)', borderRadius: 8, padding: 3, border: '1px solid var(--c-border)' }}>
            {['fr','en'].map((l) => (
              <button key={l} onClick={() => switchLocale(l)} style={{
                padding: '3px 10px', borderRadius: 5, border: 'none', cursor: 'pointer',
                fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const,
                background: locale === l ? 'var(--c-blue-dim)' : 'transparent',
                color: locale === l ? '#fff' : 'var(--c-muted)',
                transition: 'all 0.2s', fontFamily: 'var(--ff-body)',
              }}>
                {l}
              </button>
            ))}
          </div>
          <ThemeBtn />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside style={{ position: 'fixed', left: 0, top: 0, height: '100vh', width: 272, borderRight: '1px solid var(--c-border)', background: 'var(--c-bg2)', overflowY: 'auto', zIndex: 50 }} className="hidden lg:block">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div style={{ position: 'fixed', left: 0, right: 0, top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--c-border)', background: 'var(--c-bg2)', padding: '0 1rem', height: 56 }} className="lg:hidden">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--c-blue)', background: 'var(--c-bg3)', flexShrink: 0 }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> // eslint-disable-line
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--c-blue)' }}>
                  {(profile?.full_name || 'D').charAt(0)}
                </div>
            }
          </div>
          <span style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-ink)' }}>
            Diègue<span style={{ color: 'var(--c-blue)' }}>.</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ThemeBtn />
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.3rem', cursor: 'pointer', color: 'var(--c-muted)', display: 'flex', alignItems: 'center' }}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} className="lg:hidden">
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={() => setMobileOpen(false)} />
          <aside style={{ position: 'absolute', left: 0, top: 56, bottom: 0, width: 272, background: 'var(--c-bg2)', overflowY: 'auto', borderRight: '1px solid var(--c-border)' }}>
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
