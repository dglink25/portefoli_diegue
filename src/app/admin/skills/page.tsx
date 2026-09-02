'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import type { Skill } from '@/types';

const EMPTY = { name: '', category: 'Langages', level: 3, order_index: 0 };

const s: React.CSSProperties = {
  width: '100%', background: 'var(--c-bg3)', border: '1px solid var(--c-border)',
  borderRadius: 8, color: 'var(--c-ink)', padding: '0.6rem 0.875rem',
  fontSize: '0.83rem', fontFamily: 'var(--ff-body)', outline: 'none',
};
const fo = {
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = 'var(--c-blue)'),
  onBlur:  (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = 'var(--c-border)'),
};

export default function SkillsAdminPage() {
  const [skills,  setSkills]  = useState<Skill[]>([]);
  const [form,    setForm]    = useState({ ...EMPTY });
  const [editing, setEditing] = useState<Skill | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');

  async function load() {
    const res = await fetch('/api/admin/skills');
    setSkills((await res.json()).skills ?? []);
  }
  useEffect(() => { load(); }, []);

  /* ── Créer ── */
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMsg('');
    await fetch('/api/admin/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ ...EMPTY });
    setSaving(false);
    setMsg('Compétence ajoutée');
    setTimeout(() => setMsg(''), 3000);
    load();
  }

  /* ── Sauvegarder modification ── */
  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    await fetch(`/api/admin/skills/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editing.name, category: editing.category,
        level: editing.level, order_index: editing.order_index,
      }),
    });
    setSaving(false);
    setEditing(null);
    load();
  }

  /* ── Supprimer ── */
  async function handleDelete(id: number) {
    if (!confirm('Supprimer cette compétence ?')) return;
    await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <AdminShell title="Compétences">
      <div className="admin-form-2col" style={{ alignItems: 'start', gap: '2rem' }}>

        {/* ── Liste ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--c-muted)', marginBottom: 4 }}>
            {skills.length} compétence(s) — cliquez sur <Pencil size={12} style={{ display:'inline', verticalAlign:'middle' }}/> pour modifier
          </p>

          {skills.length === 0 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--c-muted)' }}>Aucune compétence.</p>
          )}

          {skills.map((sk) =>
            editing?.id === sk.id ? (
              /* ── Ligne d'édition ── */
              <div key={sk.id} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--c-blue)', background: 'var(--c-bg2)' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--c-blue)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                  Modifier la compétence
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>Nom</label>
                    <input style={s} value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })} {...fo} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>Catégorie</label>
                    <input style={s} value={editing.category}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })} {...fo} />
                  </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.72rem', color: 'var(--c-ink)' }}>
                    Niveau : <strong style={{ color: 'var(--c-blue)' }}>{editing.level}/5</strong>
                  </label>
                  <input type="range" min={1} max={5} value={editing.level}
                    onChange={(e) => setEditing({ ...editing, level: Number(e.target.value) })}
                    style={{ width: '100%', marginTop: 6, accentColor: 'var(--c-blue)' }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleSave} disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 7, border: 'none', background: 'var(--c-blue-dim)', color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--ff-body)' }}>
                    <Check size={14} /> Enregistrer
                  </button>
                  <button onClick={() => setEditing(null)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 7, border: '1px solid var(--c-border)', background: 'transparent', color: 'var(--c-muted)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--ff-body)' }}>
                    <X size={14} /> Annuler
                  </button>
                </div>
              </div>
            ) : (
              /* ── Ligne normale ── */
              <div key={sk.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderRadius: 10, border: '1px solid var(--c-border)', background: 'var(--c-bg2)', transition: 'border-color .2s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--c-blue)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--c-border)')}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--c-ink)' }}>{sk.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: '.72rem', color: 'var(--c-muted)' }}>{sk.category}</span>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map((n) => (
                        <div key={n} style={{ width: 14, height: 3, borderRadius: 2, background: n <= sk.level ? 'var(--c-blue)' : 'var(--c-border)' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '.72rem', color: 'var(--c-blue)' }}>{sk.level}/5</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => setEditing({ ...sk })}
                    title="Modifier"
                    style={{ padding: '.4rem', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--c-muted)', display: 'flex', alignItems: 'center', transition: 'all .2s' }}
                    onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = 'rgba(9,105,218,.08)'; el.style.color = 'var(--c-blue)'; }}
                    onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = 'transparent'; el.style.color = 'var(--c-muted)'; }}>
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(sk.id)}
                    title="Supprimer"
                    style={{ padding: '.4rem', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--c-muted)', display: 'flex', alignItems: 'center', transition: 'all .2s' }}
                    onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = 'rgba(207,34,46,.08)'; el.style.color = '#cf222e'; }}
                    onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = 'transparent'; el.style.color = 'var(--c-muted)'; }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* ── Formulaire ajout ── */}
        <form onSubmit={handleCreate} style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 14, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', position: 'sticky', top: 80 }}>
          <p style={{ fontFamily: 'var(--ff-display)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--c-ink)' }}>
            Nouvelle compétence
          </p>
          <div>
            <label style={{ fontSize: '.68rem', fontWeight: 700, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '.1em', display: 'block', marginBottom: 5 }}>Nom *</label>
            <input required placeholder="ex: TypeScript" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} style={s} {...fo} />
          </div>
          <div>
            <label style={{ fontSize: '.68rem', fontWeight: 700, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '.1em', display: 'block', marginBottom: 5 }}>Catégorie *</label>
            <input required placeholder="ex: Frontend, Backend..." value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })} style={s} {...fo} />
          </div>
          <div>
            <label style={{ fontSize: '.72rem', color: 'var(--c-ink)' }}>
              Niveau : <strong style={{ color: 'var(--c-blue)' }}>{form.level}/5</strong>
            </label>
            <input type="range" min={1} max={5} value={form.level}
              onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
              style={{ width: '100%', marginTop: 6, accentColor: 'var(--c-blue)' }} />
          </div>
          <div>
            <label style={{ fontSize: '.68rem', fontWeight: 700, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '.1em', display: 'block', marginBottom: 5 }}>Ordre</label>
            <input type="number" value={form.order_index}
              onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} style={s} {...fo} />
          </div>
          {msg && <p style={{ fontSize: '.78rem', color: 'var(--c-green)' }}>{msg}</p>}
          <button type="submit" disabled={saving}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '.65rem 1rem', borderRadius: 8, border: 'none', background: 'var(--c-blue-dim)', color: '#fff', fontSize: '.83rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .6 : 1, fontFamily: 'var(--ff-body)', transition: 'all .2s' }}>
            <Plus size={15} /> Ajouter
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
