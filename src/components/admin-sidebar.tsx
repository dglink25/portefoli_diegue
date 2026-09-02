'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, FolderKanban, Sparkles, Briefcase,
  Star, User, Settings, LogOut, Images, Sun, Moon,
} from 'lucide-react';

const items = [
  { href: '/admin/dashboard',  label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/projects',   label: 'Projets',         icon: FolderKanban },
  { href: '/admin/skills',     label: 'Compétences',     icon: Sparkles },
  { href: '/admin/experiences',label: 'Parcours',        icon: Briefcase },
  { href: '/admin/gallery',    label: 'Galerie',         icon: Images },
  { href: '/admin/reviews',    label: 'Avis',            icon: Star },
  { href: '/admin/profile',    label: 'Profil',          icon: User },
  { href: '/admin/settings',   label: 'Paramètres',      icon: Settings },
];

function ThemeBtn() {
  const { resolvedTheme, setTheme } = useTheme();
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  if (!m) return null;
  const dark = resolvedTheme === 'dark';
  return (
    <button
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--c-muted)', fontSize: '0.82rem', fontFamily: 'var(--ff-body)', transition: 'all 0.2s' }}
      onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = 'var(--c-bg3)'; el.style.color = 'var(--c-ink)'; }}
      onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = 'transparent'; el.style.color = 'var(--c-muted)'; }}
    >
      {dark ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} />}
      {dark ? 'Thème clair' : 'Thème sombre'}
    </button>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{ display: 'flex', height: '100vh', width: 240, flexShrink: 0, flexDirection: 'column', borderRight: '1px solid var(--c-border)', background: 'var(--c-bg2)', position: 'sticky', top: 0 }}>
      {/* Header */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--c-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--c-blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: '0.8rem', color: '#fff', flexShrink: 0 }}>
            DH
          </div>
          <div>
            <p style={{ fontFamily: 'var(--ff-display)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--c-ink)' }}>Backoffice</p>
            <p style={{ fontSize: '0.68rem', color: 'var(--c-muted)' }}>Portfolio admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0.55rem 0.75rem', borderRadius: 8, marginBottom: 2,
                fontSize: '0.82rem', fontWeight: active ? 600 : 500, textDecoration: 'none',
                background: active ? 'rgba(9,105,218,0.1)' : 'transparent',
                color: active ? 'var(--c-blue)' : 'var(--c-muted)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { if (!active) { const el = e.currentTarget; el.style.background = 'var(--c-bg3)'; el.style.color = 'var(--c-ink)'; } }}
              onMouseLeave={(e) => { if (!active) { const el = e.currentTarget; el.style.background = 'transparent'; el.style.color = 'var(--c-muted)'; } }}
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--c-border)', padding: '0.75rem' }}>
        <ThemeBtn />
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--c-muted)', fontSize: '0.82rem', fontFamily: 'var(--ff-body)', transition: 'all 0.2s', marginTop: 2 }}
          onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = 'rgba(207,34,46,0.08)'; el.style.color = '#cf222e'; }}
          onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = 'transparent'; el.style.color = 'var(--c-muted)'; }}
        >
          <LogOut size={16} strokeWidth={1.75} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
