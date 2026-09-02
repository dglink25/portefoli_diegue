'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { ImageUpload } from '@/components/image-upload';
import { Save } from 'lucide-react';
import type { Profile } from '@/types';

const inp = { width: '100%', background: 'var(--c-bg3)', border: '1px solid var(--c-border)', borderRadius: 8, color: 'var(--c-ink)', padding: '0.65rem 1rem', fontSize: '0.84rem', fontFamily: 'var(--ff-body)', outline: 'none' } as const;

export default function ProfileAdminPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status,  setStatus]  = useState<'idle'|'saving'|'saved'>('idle');

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
      body: JSON.stringify(profile),
    });
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 3000);
  }

  if (!profile) return (
    <AdminShell title="Profil">
      <p style={{ fontSize: '0.85rem', color: 'var(--c-muted)' }}>Chargement...</p>
    </AdminShell>
  );

  return (
    <AdminShell title="Profil">
      <form onSubmit={handleSave} style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Avatar */}
        <ImageUpload
          label="Photo de profil"
          value={profile.avatar_url ?? ''}
          onChange={(url) => setProfile({ ...profile, avatar_url: url })}
          aspectRatio="square"
          placeholder="https://... ou choisir un fichier"
        />

        {/* Nom */}
        <div>
          <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Nom complet</label>
          <input style={inp} placeholder="Nom complet" value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
        </div>

        {/* Titres */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Titre (FR)</label>
            <input style={inp} placeholder="Développeur Full-Stack..." value={profile.title_fr}
              onChange={(e) => setProfile({ ...profile, title_fr: e.target.value })}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Title (EN)</label>
            <input style={inp} placeholder="Full-Stack Developer..." value={profile.title_en}
              onChange={(e) => setProfile({ ...profile, title_en: e.target.value })}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
          </div>
        </div>

        {/* Bios */}
        {[{ label: 'Bio (FR)', field: 'bio_fr' as const, val: profile.bio_fr },
          { label: 'Bio (EN)', field: 'bio_en' as const, val: profile.bio_en }].map(({ label, field, val }) => (
          <div key={field}>
            <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>{label}</label>
            <textarea rows={4} style={{ ...inp, resize: 'vertical' as const }} value={val}
              onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
          </div>
        ))}

        {/* Email + Location */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Email</label>
            <input type="email" style={inp} value={profile.email ?? ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Localisation</label>
            <input style={inp} value={profile.location ?? ''}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
          </div>
        </div>

        {/* Save */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="submit" disabled={status === 'saving'} className="btn-primary" style={{ opacity: status === 'saving' ? 0.6 : 1 }}>
            <Save size={15} /> {status === 'saving' ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          {status === 'saved' && (
            <span style={{ fontSize: '0.82rem', color: 'var(--c-green)' }}>Profil mis à jour.</span>
          )}
        </div>
      </form>
    </AdminShell>
  );
}
