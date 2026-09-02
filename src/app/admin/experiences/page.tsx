'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Plus, Trash2 } from 'lucide-react';
import type { Experience } from '@/types';

const empty = {
  title_fr: '', title_en: '', company: '', location: '',
  description_fr: '', description_en: '', start_date: '', end_date: '', order_index: 0
};

export default function ExperiencesAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [form, setForm] = useState(empty);

  async function load() {
    const res = await fetch('/api/admin/experiences');
    const data = await res.json();
    setExperiences(data.experiences ?? []);
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/admin/experiences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, end_date: form.end_date || null })
    });
    setForm(empty);
    load();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/admin/experiences/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <AdminShell title="Parcours">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-3">
          {experiences.map((exp) => (
            <div key={exp.id} className="flex items-center justify-between rounded-lg border border-border-light p-4 dark:border-border-dark">
              <div>
                <p className="text-sm font-medium">{exp.title_fr} · {exp.company}</p>
                <p className="text-xs text-muted-light dark:text-muted-dark">{exp.start_date} → {exp.end_date ?? 'aujourd\u2019hui'}</p>
              </div>
              <button type="button" onClick={() => handleDelete(exp.id)} aria-label="Supprimer"
                className="rounded-md p-2 text-muted-light hover:bg-red-50 hover:text-red-600 dark:text-muted-dark">
                <Trash2 size={16} strokeWidth={1.75} />
              </button>
            </div>
          ))}
          {experiences.length === 0 && <p className="text-sm text-muted-light dark:text-muted-dark">Aucune experience.</p>}
        </div>

        <form onSubmit={handleCreate} className="flex flex-col gap-3 rounded-lg border border-border-light p-5 dark:border-border-dark">
          <p className="text-sm font-medium">Nouvelle experience</p>
          <input required placeholder="Poste (FR)" value={form.title_fr}
            onChange={(e) => setForm({ ...form, title_fr: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <input required placeholder="Role (EN)" value={form.title_en}
            onChange={(e) => setForm({ ...form, title_en: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <input required placeholder="Entreprise" value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <input placeholder="Lieu" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <div className="grid grid-cols-2 gap-3">
            <input required type="date" value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
            <input type="date" value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          </div>
          <textarea placeholder="Description (FR)" rows={2} value={form.description_fr}
            onChange={(e) => setForm({ ...form, description_fr: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <textarea placeholder="Description (EN)" rows={2} value={form.description_en}
            onChange={(e) => setForm({ ...form, description_en: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <button type="submit"
            className="mt-1 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            <Plus size={16} strokeWidth={1.75} /> Ajouter
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
