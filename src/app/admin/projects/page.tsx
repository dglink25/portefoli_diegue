'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Plus, Trash2 } from 'lucide-react';
import type { Project } from '@/types';

const empty = {
  slug: '', title_fr: '', title_en: '', description_fr: '', description_en: '',
  cover_image: '', tags: '', demo_url: '', repo_url: '', featured: false, published: true, order_index: 0
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch('/api/admin/projects');
    const data = await res.json();
    setProjects(data.projects ?? []);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      })
    });
    setForm(empty);
    setLoading(false);
    load();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <AdminShell title="Projets">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-3">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-border-light p-4 dark:border-border-dark">
              <div>
                <p className="text-sm font-medium">{p.title_fr}</p>
                <p className="text-xs text-muted-light dark:text-muted-dark">/{p.slug} · {p.published ? 'publie' : 'brouillon'}</p>
              </div>
              <button type="button" onClick={() => handleDelete(p.id)} aria-label="Supprimer"
                className="rounded-md p-2 text-muted-light hover:bg-red-50 hover:text-red-600 dark:text-muted-dark">
                <Trash2 size={16} strokeWidth={1.75} />
              </button>
            </div>
          ))}
          {projects.length === 0 && <p className="text-sm text-muted-light dark:text-muted-dark">Aucun projet.</p>}
        </div>

        <form onSubmit={handleCreate} className="flex flex-col gap-3 rounded-lg border border-border-light p-5 dark:border-border-dark">
          <p className="text-sm font-medium">Nouveau projet</p>
          <input required placeholder="slug (ex: mon-projet)" value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <input required placeholder="Titre (FR)" value={form.title_fr}
            onChange={(e) => setForm({ ...form, title_fr: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <input required placeholder="Title (EN)" value={form.title_en}
            onChange={(e) => setForm({ ...form, title_en: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <textarea placeholder="Description (FR)" rows={2} value={form.description_fr}
            onChange={(e) => setForm({ ...form, description_fr: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <textarea placeholder="Description (EN)" rows={2} value={form.description_en}
            onChange={(e) => setForm({ ...form, description_en: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <input placeholder="URL image" value={form.cover_image}
            onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <input placeholder="Tags (separes par une virgule)" value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <input placeholder="URL demo" value={form.demo_url}
            onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <input placeholder="URL depot" value={form.repo_url}
            onChange={(e) => setForm({ ...form, repo_url: e.target.value })}
            className="rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Publie
          </label>
          <button type="submit" disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
            <Plus size={16} strokeWidth={1.75} /> Ajouter
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
