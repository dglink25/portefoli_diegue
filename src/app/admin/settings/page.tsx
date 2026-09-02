'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Save } from 'lucide-react';

interface ThemeSetting {
  default: 'light' | 'dark';
  allowUserOverride: boolean;
  primaryColor: string;
  footerColor: string;
}

export default function SettingsAdminPage() {
  const [theme, setTheme] = useState<ThemeSetting | null>(null);
  const [status, setStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        const row = d.settings?.find((s: any) => s.key === 'theme');
        if (row) setTheme(row.value);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!theme) return;
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'theme', value: theme })
    });
    setStatus('saved');
  }

  if (!theme) return <AdminShell title="Parametres"><p className="text-sm text-muted-light">Chargement...</p></AdminShell>;

  return (
    <AdminShell title="Parametres">
      <form onSubmit={handleSave} className="flex max-w-md flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Theme par defaut</label>
          <select value={theme.default} onChange={(e) => setTheme({ ...theme, default: e.target.value as 'light' | 'dark' })}
            className="w-full rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark">
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={theme.allowUserOverride}
            onChange={(e) => setTheme({ ...theme, allowUserOverride: e.target.checked })} />
          Autoriser les visiteurs a changer de theme
        </label>
        <p className="text-xs text-muted-light dark:text-muted-dark">
          Couleur principale : {theme.primaryColor} · Couleur du pied de page : {theme.footerColor}
        </p>
        <button type="submit"
          className="flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          <Save size={16} strokeWidth={1.75} /> Enregistrer
        </button>
        {status === 'saved' && <p className="text-sm text-primary">Parametres mis a jour.</p>}
      </form>
    </AdminShell>
  );
}
