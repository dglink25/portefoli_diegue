'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { ImageUpload } from '@/components/image-upload';
import { Plus, Trash2 } from 'lucide-react';
import type { Project } from '@/types';

const EMPTY = {
  slug: '', title_fr: '', title_en: '', description_fr: '', description_en: '',
  cover_image: '', tags: '', demo_url: '', repo_url: '', featured: false, published: true, order_index: 0,
};

const inp: React.CSSProperties = { width: '100%', background: 'var(--c-bg3)', border: '1px solid var(--c-border)', borderRadius: 8, color: 'var(--c-ink)', padding: '0.6rem 0.875rem', fontSize: '0.83rem', fontFamily: 'var(--ff-body)', outline: 'none' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.66rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 5 };

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
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
    setForm({ ...EMPTY });
    setLoading(false);
    load();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <AdminShell title="Projets">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,400px)', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {projects.map((p) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderRadius: 10, border: '1px solid var(--c-border)', background: 'var(--c-bg2)' }}>
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-ink)' }}>{p.title_fr}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--c-muted)' }}>/{p.slug} · {p.published ? 'publié' : 'brouillon'}</p>
              </div>
              <button type="button" onClick={() => handleDelete(p.id)}
                style={{ padding: '0.4rem', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--c-muted)', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = 'rgba(207,34,46,0.08)'; el.style.color = '#cf222e'; }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = 'transparent'; el.style.color = 'var(--c-muted)'; }}>
                <Trash2 size={16} strokeWidth={1.75} />
              </button>
            </div>
          ))}
          {projects.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--c-muted)' }}>Aucun projet.</p>}
        </div>

        <form onSubmit={handleCreate} style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 14, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--c-ink)', marginBottom: 4 }}>Nouveau projet</h3>

          <ImageUpload label="Image de couverture" value={form.cover_image} onChange={(url) => setForm({ ...form, cover_image: url })} aspectRatio="wide" />

          {[
            { ph: 'slug (ex: mon-projet)', field: 'slug' as const, req: true },
            { ph: 'Titre (FR)', field: 'title_fr' as const, req: true },
            { ph: 'Title (EN)', field: 'title_en' as const, req: true },
          ].map(({ ph, field, req }) => (
            <div key={field}>
              <input required={req} placeholder={ph} value={(form as any)[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })} style={inp}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
            </div>
          ))}
          {[
            { ph: 'Description (FR)', field: 'description_fr' as const },
            { ph: 'Description (EN)', field: 'description_en' as const },
          ].map(({ ph, field }) => (
            <textarea key={field} placeholder={ph} rows={2} value={(form as any)[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })} style={{ ...inp, resize: 'vertical' as const }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
          ))}
          <input placeholder="Tags (séparés par virgule)" value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })} style={inp}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
          <input placeholder="URL démo" value={form.demo_url}
            onChange={(e) => setForm({ ...form, demo_url: e.target.value })} style={inp}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
          <input placeholder="URL dépôt" value={form.repo_url}
            onChange={(e) => setForm({ ...form, repo_url: e.target.value })} style={inp}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.83rem', cursor: 'pointer', color: 'var(--c-ink)' }}>
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} style={{ accentColor: 'var(--c-blue)', width: 14, height: 14 }} />
            Publier
          </label>
          <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
            <Plus size={15} /> Ajouter
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
