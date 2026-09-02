'use client';

import { AdminShell } from '@/components/admin-shell';
import { FolderKanban, Sparkles, Briefcase, Star } from 'lucide-react';
import Link from 'next/link';

const shortcuts = [
  { href: '/admin/projects', label: 'Gerer les projets', icon: FolderKanban },
  { href: '/admin/skills', label: 'Gerer les competences', icon: Sparkles },
  { href: '/admin/experiences', label: 'Gerer le parcours', icon: Briefcase },
  { href: '/admin/reviews', label: 'Moderer les avis', icon: Star }
];

export default function DashboardPage() {
  return (
    <AdminShell title="Tableau de bord">
      <p className="text-sm text-muted-light dark:text-muted-dark">
        Bienvenue. Utilisez le menu pour mettre a jour le contenu affiche sur le portfolio public.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shortcuts.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className="flex flex-col items-start gap-3 rounded-lg border border-border-light p-5 transition-colors hover:border-primary dark:border-border-dark">
            <Icon size={20} strokeWidth={1.75} className="text-primary" />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
