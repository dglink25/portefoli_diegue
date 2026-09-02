'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Save, Plus, Trash2 } from 'lucide-react';
import type { Stat } from '@/app/[locale]/page';

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--c-bg3)', border: '1px solid var(--c-border)',
  borderRadius: 8, color: 'var(--c-ink)', padding: '.6rem .875rem',
  fontSize: '.83rem', fontFamily: 'var(--ff-body)', outline: 'none',
};
const lbl: React.CSSProperties = {
  display: 'block', fontSize: '.66rem', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--c-muted)', marginBottom: 4,
};
const fo = {
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = 'var(--c-blue)'),
  onBlur:  (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = 'var(--c-border)'),
};

const DEFAULT: Stat[] = [
  { value: 3,  suffix: '+', label_fr: "Années d'expérience", label_en: "Years' experience" },
  { value: 10, suffix: '+', label_fr: 'Projets réalisés',    label_en: 'Projects done' },
  { value: 15, suffix: '+', label_fr: 'Technologies',         label_en: 'Technologies' },
  { value: 2,  suffix: '',  label_fr: 'Organisations dirigées', label_en: 'Organisations led' },
];

export default function SettingsAdminPage() {
  const [stats,  setStats]  = useState<Stat[]>(DEFAULT);
  const [status, setStatus] = useState<'idle'|'saving'|'saved'|'err'>('idle');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        const row = d.settings?.find((s: any) => s.key === 'stats');
        if (row?.value && Array.isArray(row.value)) setStats(row.value);
      });
  }, []);

  function updateStat(i: number, field: keyof Stat, val: string | number) {
    setStats((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  }

  function addStat() {
    setStats((prev) => [...prev, { value: 0, suffix: '+', label_fr: '', label_en: '' }]);
  }

  function removeStat(i: number) {
    setStats((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'stats', value: stats }),
    });
    setStatus(res.ok ? 'saved' : 'err');
    if (res.ok) setTimeout(() => setStatus('idle'), 3000);
  }

  return (
    <AdminShell title="Statistiques du portfolio">
      <form onSubmit={handleSave} style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        <div style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 14, padding: '1.25rem' }}>
          <p style={{ fontFamily: 'var(--ff-display)', fontSize: '.9rem', fontWeight: 700, color: 'var(--c-ink)', marginBottom: '.5rem' }}>
            Chiffres clés
          </p>
          <p style={{ fontSize: '.78rem', color: 'var(--c-muted)', marginBottom: '1.5rem' }}>
            Ces statistiques apparaissent dans le Hero et la section À propos avec animation count-up.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ background: 'var(--c-bg3)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
                  <span style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--c-blue)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                    Statistique {i + 1}
                  </span>
                  <button type="button" onClick={() => removeStat(i)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--c-muted)', display: 'flex', alignItems: 'center', padding: '.25rem', borderRadius: 6, transition: 'all .2s' }}
                    onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = 'rgba(207,34,46,.08)'; el.style.color = '#cf222e'; }}
                    onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = 'transparent'; el.style.color = 'var(--c-muted)'; }}>
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem', padding: '.5rem .75rem', background: 'var(--c-bg2)', borderRadius: 8 }}>
                  <span style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--c-blue)' }}>
                    {s.value}{s.suffix}
                  </span>
                  <span style={{ fontSize: '.75rem', color: 'var(--c-muted)' }}>{s.label_fr}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '100px 80px 1fr 1fr', gap: '.75rem', alignItems: 'end' }}>
                  <div>
                    <label style={lbl}>Valeur</label>
                    <input type="number" min={0} max={9999} value={s.value}
                      onChange={(e) => updateStat(i, 'value', Number(e.target.value))} style={inp} {...fo} />
                  </div>
                  <div>
                    <label style={lbl}>Suffixe</label>
                    <input maxLength={5} value={s.suffix}
                      onChange={(e) => updateStat(i, 'suffix', e.target.value)} style={inp} {...fo} placeholder="+" />
                  </div>
                  <div>
                    <label style={lbl}>Label FR</label>
                    <input required value={s.label_fr}
                      onChange={(e) => updateStat(i, 'label_fr', e.target.value)} style={inp} {...fo} placeholder="Ex : Années d'expérience" />
                  </div>
                  <div>
                    <label style={lbl}>Label EN</label>
                    <input required value={s.label_en}
                      onChange={(e) => updateStat(i, 'label_en', e.target.value)} style={inp} {...fo} placeholder="Ex : Years' experience" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button type="button" onClick={addStat}
            style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: 8, padding: '.55rem 1rem', borderRadius: 8, border: '1px dashed var(--c-border)', background: 'transparent', cursor: 'pointer', color: 'var(--c-muted)', fontSize: '.82rem', fontFamily: 'var(--ff-body)', transition: 'all .2s' }}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = 'var(--c-blue)'; el.style.color = 'var(--c-blue)'; }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = 'var(--c-border)'; el.style.color = 'var(--c-muted)'; }}>
            <Plus size={14} /> Ajouter une statistique
          </button>
        </div>

        {/* Save */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="submit" disabled={status === 'saving'} className="btn-primary"
            style={{ opacity: status === 'saving' ? .6 : 1 }}>
            <Save size={15} /> {status === 'saving' ? 'Enregistrement...' : 'Enregistrer les statistiques'}
          </button>
          {status === 'saved' && (
            <span style={{ fontSize: '.82rem', color: 'var(--c-green)', background: 'rgba(26,127,55,.08)', border: '1px solid rgba(26,127,55,.2)', borderRadius: 6, padding: '4px 10px' }}>
              Statistiques mises à jour
            </span>
          )}
          {status === 'err' && (
            <span style={{ fontSize: '.82rem', color: '#cf222e' }}>Erreur lors de la sauvegarde</span>
          )}
        </div>
      </form>
    </AdminShell>
  );
}
