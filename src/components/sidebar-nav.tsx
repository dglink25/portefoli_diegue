'use client';

import { useState } from 'react';
import type { Profile } from '@/types';
import { Menu, X, Github, Linkedin, Mail, Globe } from 'lucide-react';

const NAV = [
  { id: 'hero',       label: 'Accueil',      icon: '🏠' },
  { id: 'about',      label: 'À propos',     icon: '👤' },
  { id: 'skills',     label: 'Compétences',  icon: '🛠️' },
  { id: 'projects',   label: 'Projets',      icon: '💼' },
  { id: 'experience', label: 'Parcours',     icon: '📋' },
  { id: 'gallery',    label: 'Galerie',      icon: '🖼️' },
  { id: 'reviews',    label: 'Avis',         icon: '⭐' },
  { id: 'contact',    label: 'Contact',      icon: '✉️' },
];

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

  const NavContent = () => (
    <div className="flex h-full flex-col">
      {/* Profile block */}
      <div className="flex flex-col items-center border-b border-border px-6 py-8">
        <div className="relative mb-4">
          <div className="anim-pulse h-20 w-20 overflow-hidden rounded-full border-2 border-primary/50">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/20 font-display text-2xl font-bold text-primary">
                {(profile?.full_name || 'D').charAt(0)}
              </div>
            )}
          </div>
        </div>
        <p className="text-center font-display text-sm font-bold text-ink leading-tight">
          {profile?.full_name || 'Hotègni Diègue HOUNDOKINNOU'}
        </p>
        <p className="mt-1 text-center text-xs text-primary font-medium">
          {profile?.title_fr || 'Développeur Full-Stack & IA'}
        </p>

        {/* Social icons */}
        <div className="mt-4 flex gap-2">
          {social.github && (
            <a href={social.github} target="_blank" rel="noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted hover:border-primary hover:text-primary transition-colors">
              <Github size={13} />
            </a>
          )}
          {social.linkedin && (
            <a href={social.linkedin} target="_blank" rel="noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted hover:border-primary hover:text-primary transition-colors">
              <Linkedin size={13} />
            </a>
          )}
          <a href={`mailto:${profile?.email || 'dondiegue21@gmail.com'}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted hover:border-primary hover:text-primary transition-colors">
            <Mail size={13} />
          </a>
          {social.website && (
            <a href={social.website} target="_blank" rel="noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted hover:border-primary hover:text-primary transition-colors">
              <Globe size={13} />
            </a>
          )}
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={`relative w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'nav-active bg-primary/10 text-primary'
                      : 'text-muted hover:bg-surface2 hover:text-ink'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom locale + status */}
      <div className="border-t border-border px-6 py-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-muted">Disponible pour missions</span>
        </div>
        <div className="flex gap-2">
          {['fr', 'en'].map((l) => (
            <button
              key={l}
              onClick={() => {
                const path = window.location.pathname;
                const segments = path.split('/');
                if (['fr','en'].includes(segments[1])) segments[1] = l === 'fr' ? '' : l;
                else if (l !== 'fr') segments.unshift('', l);
                window.location.href = segments.join('/').replace('//', '/') || '/';
              }}
              className={`rounded px-2.5 py-1 text-xs font-bold uppercase transition-colors ${
                locale === l ? 'bg-primary text-white' : 'border border-border text-muted hover:text-ink'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col overflow-hidden border-r border-border bg-surface lg:flex">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-border bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-full border border-primary/50">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/20 text-xs font-bold text-primary">
                {(profile?.full_name || 'D').charAt(0)}
              </div>
            )}
          </div>
          <span className="font-display text-sm font-bold text-ink">
            <span className="text-primary">D</span>iègue
          </span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1 text-muted hover:text-ink">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-surface">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
