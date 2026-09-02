'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { ImageUpload } from '@/components/image-upload';
import { Plus, Trash2, Eye, EyeOff, Images } from 'lucide-react';

interface GalleryItem {
  id: number; title: string; description: string | null;
  image_url: string; category: string; order_index: number; published: boolean;
}

const EMPTY = { title: '', description: '', image_url: '', category: 'general', order_index: 0, published: true };

const inp: React.CSSProperties = { width: '100%', background: 'var(--c-bg3)', border: '1px solid var(--c-border)', borderRadius: 8, color: 'var(--c-ink)', padding: '0.6rem 0.875rem', fontSize: '0.83rem', fontFamily: 'var(--ff-body)', outline: 'none' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.66rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 5 };

export default function GalleryAdminPage() {
  const [items,   setItems]   = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState({ ...EMPTY });
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/gallery');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.image_url) { setMsg('Veuillez choisir ou saisir une image.'); return; }
    setSaving(true); setMsg('');
    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, order_index: Number(form.order_index) }),
    });
    setSaving(false);
    if (res.ok) { setMsg('Photo ajoutée avec succès'); setForm({ ...EMPTY }); load(); }
    else setMsg('Erreur lors de l\'ajout');
  }

  async function togglePublished(item: GalleryItem) {
    await fetch(`/api/admin/gallery/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published: !item.published }) });
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer cette photo ?')) return;
    await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <AdminShell title="Galerie">
      <div style={{ maxWidth: 900, padding: '0.5rem 0' }}>
        {/* Stats */}
        <p style={{ fontSize: '0.82rem', color: 'var(--c-muted)', marginBottom: '1.5rem' }}>{items.length} photo(s) dans la galerie</p>

        {/* Add form */}
        <form onSubmit={handleAdd} style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 14, padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--c-ink)', marginBottom: '1.25rem' }}>Ajouter une photo</h2>

          {/* Image upload */}
          <div style={{ marginBottom: '1rem' }}>
            <ImageUpload
              label="Image *"
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              aspectRatio="wide"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={lbl}>Titre *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inp} placeholder="Mon souvenir..."
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
            </div>
            <div>
              <label style={lbl}>Catégorie</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inp} placeholder="voyage, événement..."
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
            </div>
            <div>
              <label style={lbl}>Description</label>
              <input value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inp} placeholder="Optionnel..."
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
            </div>
            <div>
              <label style={lbl}>Ordre d&apos;affichage</label>
              <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} style={inp}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.83rem', color: 'var(--c-ink)', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} style={{ accentColor: 'var(--c-blue)', width: 15, height: 15 }} />
              Publier immédiatement
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {msg && <p style={{ fontSize: '0.8rem', color: msg.includes('succès') ? 'var(--c-green)' : '#cf222e' }}>{msg}</p>}
              <button type="submit" disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.6 : 1 }}>
                <Plus size={15} /> Ajouter
              </button>
            </div>
          </div>
        </form>

        {/* Grid */}
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--c-muted)', padding: '3rem', fontSize: '0.85rem' }}>Chargement...</p>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--c-muted)' }}>
            <Images size={36} strokeWidth={1} style={{ margin: '0 auto 0.75rem', display: 'block' }} />
            <p style={{ fontSize: '0.85rem' }}>Aucune photo pour le moment</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {items.map((item) => (
              <div key={item.id} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--c-border)', background: 'var(--c-bg2)' }}
                onMouseEnter={(e) => e.currentTarget.querySelector<HTMLDivElement>('.item-actions')!.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.querySelector<HTMLDivElement>('.item-actions')!.style.opacity = '0'}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt={item.title} style={{ height: 140, width: '100%', objectFit: 'cover', display: 'block' }} />
                {!item.published && (
                  <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.65)', borderRadius: 20, padding: '2px 8px', fontSize: '0.65rem', color: '#fff', fontWeight: 600 }}>Masqué</div>
                )}
                <div className="item-actions" style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 4, opacity: 0, transition: 'opacity 0.2s' }}>
                  <button onClick={() => togglePublished(item)} style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-muted)' }}>
                    {item.published ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button onClick={() => handleDelete(item.id)} style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cf222e' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <div style={{ padding: '0.6rem 0.75rem' }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--c-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--c-muted)' }}>{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
