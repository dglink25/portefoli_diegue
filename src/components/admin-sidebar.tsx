'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, FolderKanban, Sparkles, Briefcase, Star, User, Settings, LogOut, Images
} from 'lucide-react';

const items = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projets', icon: FolderKanban },
  { href: '/admin/skills', label: 'Compétences', icon: Sparkles },
  { href: '/admin/experiences', label: 'Parcours', icon: Briefcase },
  { href: '/admin/gallery', label: 'Galerie', icon: Images },
  { href: '/admin/reviews', label: 'Avis', icon: Star },
  { href: '/admin/profile', label: 'Profil', icon: User },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-none flex-col border-r border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark">
      <div className="px-5 py-6">
        <p className="font-display text-base font-semibold tracking-tight">Backoffice</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-light hover:bg-canvas-light hover:text-ink-light dark:text-muted-dark dark:hover:bg-canvas-dark dark:hover:text-ink-dark'
              }`}
            >
              <Icon size={17} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border-light p-3 dark:border-border-dark">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-light transition-colors hover:bg-canvas-light hover:text-ink-light dark:text-muted-dark dark:hover:bg-canvas-dark dark:hover:text-ink-dark"
        >
          <LogOut size={17} strokeWidth={1.75} />
          Se deconnecter
        </button>
      </div>
    </aside>
  );
}
