'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Plus, Trash2, Eye, EyeOff, GripVertical, Images } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  order_index: number;
  published: boolean;
}

const EMPTY: Omit<GalleryItem, 'id' | 'published'> & { published: boolean } = {
  title: '', description: '', image_url: '', category: 'general', order_index: 0, published: true,
};

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/gallery');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMsg('');
    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, order_index: Number(form.order_index) }),
    });
    setSaving(false);
    if (res.ok) { setMsg('Photo ajoutée ✓'); setForm({ ...EMPTY }); load(); }
    else setMsg('Erreur lors de l\'ajout');
  }

  async function togglePublished(item: GalleryItem) {
    await fetch(`/api/admin/gallery/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !item.published }),
    });
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer cette photo ?')) return;
    await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
    load();
  }

  const inputClass = 'w-full rounded-lg border border-border-light bg-canvas-light px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-canvas-dark';

  return (
    <AdminShell>
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Images size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">Galerie</h1>
            <p className="text-sm text-muted-light dark:text-muted-dark">{items.length} photo(s)</p>
          </div>
        </div>

        {/* Add form */}
        <form onSubmit={handleAdd} className="mb-8 rounded-2xl border border-border-light bg-surface-light p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
          <h2 className="mb-4 font-display text-base font-semibold">Ajouter une photo</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">Titre *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Mon souvenir..." />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">Catégorie</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} placeholder="voyage, événement, perso..." />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">URL de l'image *</label>
              <input required type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputClass} placeholder="https://..." />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">Description</label>
              <input value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} placeholder="Optionnel..." />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">Ordre</label>
              <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className={inputClass} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 accent-primary" />
              Publier immédiatement
            </label>
            <div className="flex items-center gap-3">
              {msg && <p className={`text-sm ${msg.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/30 transition-all hover:opacity-90 disabled:opacity-50">
                <Plus size={16} /> Ajouter
              </button>
            </div>
          </div>
        </form>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-light dark:text-muted-dark">Chargement...</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-light dark:text-muted-dark">
            <Images size={40} strokeWidth={1} />
            <p className="text-sm">Aucune photo pour le moment</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-border-light bg-surface-light shadow-sm dark:border-border-dark dark:bg-surface-dark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt={item.title} className="h-40 w-full object-cover" />
                {!item.published && (
                  <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">Masqué</div>
                )}
                <div className="p-3">
                  <p className="font-semibold text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-light dark:text-muted-dark">{item.category}</p>
                </div>
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => togglePublished(item)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-ink-light shadow transition-colors hover:text-primary dark:bg-surface-dark/90 dark:text-ink-dark">
                    {item.published ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-red-500 shadow transition-colors hover:bg-red-50 dark:bg-surface-dark/90">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
