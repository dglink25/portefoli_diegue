'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Plus, Trash2 } from 'lucide-react';
import type { Skill } from '@/types';

const empty = { name: '', category: 'general', level: 3, order_index: 0 };

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState(empty);

  async function load() {
    const res = await fetch('/api/admin/skills');
    const data = await res.json();
    setSkills(data.skills ?? []);
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/admin/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm(empty);
    load();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <AdminShell title="Competences">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-3">
          {skills.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-lg border border-border-light p-4 dark:border-border-dark">
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-light dark:text-muted-dark">{s.category} · niveau {s.level}/5</p>
              </div>
              <button type="button" onClick={() => handleDelete(s.id)} aria-label="Supprimer"
                className="rounded-md p-2 text-muted-light hover:bg-red-50 hover:text-red-600 dark:text-muted-dark">
                <Trash2 size={16} strokeWidth={1.75} />
              </button>
            </div>
          ))}
          {skills.length === 0 && <p className="text-sm text-muted-light dark:text-muted-dark">Aucune competence.</p>}
        </div>

        <form onSubmit={handleCreate} className="flex flex-col gap-3 rounded-lg border border-border-light p-5 dark:border-border-dark">
          <p className="text-sm font-medium">Nouvelle competence</p>
          <input required placeholder="Nom (ex: TypeScript)" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <input required placeholder="Categorie (ex: Frontend)" value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <label className="text-sm">
            Niveau : {form.level}/5
            <input type="range" min={1} max={5} value={form.level}
              onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
              className="mt-1 w-full accent-primary" />
          </label>
          <button type="submit"
            className="mt-1 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            <Plus size={16} strokeWidth={1.75} /> Ajouter
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
