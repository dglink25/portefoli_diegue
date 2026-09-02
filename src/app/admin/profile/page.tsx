'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Save } from 'lucide-react';
import type { Profile } from '@/types';

export default function ProfileAdminPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    fetch('/api/admin/profile').then((r) => r.json()).then((d) => setProfile(d.profile));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setStatus('saving');
    await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    setStatus('saved');
  }

  if (!profile) return <AdminShell title="Profil"><p className="text-sm text-muted-light">Chargement...</p></AdminShell>;

  return (
    <AdminShell title="Profil">
      <form onSubmit={handleSave} className="flex max-w-xl flex-col gap-4">
        <input placeholder="Nom complet" value={profile.full_name}
          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
          className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Titre (FR)" value={profile.title_fr}
            onChange={(e) => setProfile({ ...profile, title_fr: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <input placeholder="Title (EN)" value={profile.title_en}
            onChange={(e) => setProfile({ ...profile, title_en: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
        </div>
        <textarea placeholder="Bio (FR)" rows={3} value={profile.bio_fr}
          onChange={(e) => setProfile({ ...profile, bio_fr: e.target.value })}
          className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
        <textarea placeholder="Bio (EN)" rows={3} value={profile.bio_en}
          onChange={(e) => setProfile({ ...profile, bio_en: e.target.value })}
          className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
        <input placeholder="URL avatar" value={profile.avatar_url ?? ''}
          onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
          className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Email" value={profile.email ?? ''}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <input placeholder="Localisation" value={profile.location ?? ''}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
        </div>
        <button type="submit"
          className="flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          <Save size={16} strokeWidth={1.75} /> Enregistrer
        </button>
        {status === 'saved' && <p className="text-sm text-primary">Profil mis a jour.</p>}
      </form>
    </AdminShell>
  );
}
