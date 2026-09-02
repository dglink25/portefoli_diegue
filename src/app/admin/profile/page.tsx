'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { ImageUpload } from '@/components/image-upload';
import { Save, Linkedin, Github, Twitter, MessageCircle, Mail, Globe, Instagram, Facebook } from 'lucide-react';
import type { Profile } from '@/types';

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--c-bg3)', border: '1px solid var(--c-border)',
  borderRadius: 8, color: 'var(--c-ink)', padding: '0.65rem 1rem',
  fontSize: '0.84rem', fontFamily: 'var(--ff-body)', outline: 'none',
};
const lbl: React.CSSProperties = {
  display: 'block', fontSize: '0.68rem', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.1em',
  color: 'var(--c-muted)', marginBottom: 6,
};
const fo = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'var(--c-blue)'),
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'var(--c-border)'),
};

/* Réseaux sociaux disponibles */
const SOCIALS = [
  { key: 'linkedin',  label: 'LinkedIn',   Icon: Linkedin,      ph: 'https://linkedin.com/in/...' },
  { key: 'github',    label: 'GitHub',     Icon: Github,        ph: 'https://github.com/...' },
  { key: 'twitter',   label: 'Twitter / X',Icon: Twitter,       ph: 'https://twitter.com/...' },
  { key: 'whatsapp',  label: 'WhatsApp',   Icon: MessageCircle, ph: 'https://wa.me/229...' },
  { key: 'email',     label: 'Email',      Icon: Mail,          ph: 'mailto:...' },
  { key: 'instagram', label: 'Instagram',  Icon: Instagram,     ph: 'https://instagram.com/...' },
  { key: 'facebook',  label: 'Facebook',   Icon: Facebook,      ph: 'https://facebook.com/...' },
  { key: 'website',   label: 'Site web',   Icon: Globe,         ph: 'https://mon-site.com' },
];

export default function ProfileAdminPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status,  setStatus]  = useState<'idle'|'saving'|'saved'>('idle');

  useEffect(() => {
    fetch('/api/admin/profile').then((r) => r.json()).then((d) => setProfile(d.profile));
  }, []);

  function setSocial(key: string, value: string) {
    if (!profile) return;
    setProfile({
      ...profile,
      social_links: { ...(profile.social_links ?? {}), [key]: value },
    });
  }

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

  const social = (profile.social_links ?? {}) as Record<string, string>;

  return (
    <AdminShell title="Profil">
      <form onSubmit={handleSave} style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── Photos ── */}
        <div style={{ background:'var(--c-bg2)', border:'1px solid var(--c-border)', borderRadius:14, padding:'1.5rem' }}>
          <p style={{ fontFamily:'var(--ff-display)', fontSize:'0.9rem', fontWeight:700, color:'var(--c-ink)', marginBottom:'0.5rem' }}>Photos</p>
          <p style={{ fontSize:'0.78rem', color:'var(--c-muted)', marginBottom:'1.5rem' }}>
            Deux photos indépendantes : une pour le cercle hero, une pour la section À propos.
          </p>
          <div className="admin-form-2col">
            <div>
              <p style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--c-blue)', marginBottom:'0.75rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                Photo Hero (cercle animé)
              </p>
              <ImageUpload label="" value={profile.hero_image_url ?? ''}
                onChange={(url) => setProfile({ ...profile, hero_image_url: url })}
                aspectRatio="square" placeholder="https://... ou choisir un fichier" />
              <p style={{ fontSize:'0.7rem', color:'var(--c-muted)', marginTop:6 }}>
                Si vide, utilise la photo À propos.
              </p>
            </div>
            <div>
              <p style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--c-blue)', marginBottom:'0.75rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                Photo À propos
              </p>
              <ImageUpload label="" value={profile.avatar_url ?? ''}
                onChange={(url) => setProfile({ ...profile, avatar_url: url })}
                aspectRatio="portrait" placeholder="https://... ou choisir un fichier" />
              <p style={{ fontSize:'0.7rem', color:'var(--c-muted)', marginTop:6 }}>
                Apparaît dans &quot;Qui suis-je&quot;.
              </p>
            </div>
          </div>
        </div>

        {/* ── Nom ── */}
        <div>
          <label style={lbl}>Nom complet</label>
          <input style={inp} value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} {...fo} />
        </div>

        {/* ── Titres ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={lbl}>Titre (FR)</label>
            <input style={inp} placeholder="Développeur Full-Stack..." value={profile.title_fr}
              onChange={(e) => setProfile({ ...profile, title_fr: e.target.value })} {...fo} />
          </div>
          <div>
            <label style={lbl}>Title (EN)</label>
            <input style={inp} placeholder="Full-Stack Developer..." value={profile.title_en}
              onChange={(e) => setProfile({ ...profile, title_en: e.target.value })} {...fo} />
          </div>
        </div>

        {/* ── Bios ── */}
        {[
          { l: 'Bio (FR)', field: 'bio_fr' as const, val: profile.bio_fr },
          { l: 'Bio (EN)', field: 'bio_en' as const, val: profile.bio_en },
        ].map(({ l, field, val }) => (
          <div key={field}>
            <label style={lbl}>{l}</label>
            <textarea rows={4} style={{ ...inp, resize: 'vertical' }} value={val}
              onChange={(e) => setProfile({ ...profile, [field]: e.target.value })} {...fo} />
          </div>
        ))}

        {/* ── Email + Location ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={lbl}>Email de contact</label>
            <input type="email" style={inp} value={profile.email ?? ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })} {...fo} />
          </div>
          <div>
            <label style={lbl}>Localisation</label>
            <input style={inp} value={profile.location ?? ''}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })} {...fo} />
          </div>
        </div>

        {/* ── Réseaux sociaux ── */}
        <div style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 14, padding: '1.5rem' }}>
          <p style={{ fontFamily: 'var(--ff-display)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--c-ink)', marginBottom: '1.25rem' }}>
            Réseaux sociaux
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--c-muted)', marginBottom: '1.25rem' }}>
            Laissez vide pour masquer le lien. Ces URLs apparaissent dans le footer et la section Contact.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {SOCIALS.map(({ key, label, Icon, ph }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Icône */}
                <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 8, background: social[key] ? 'rgba(9,105,218,.12)' : 'var(--c-bg3)', border: `1px solid ${social[key] ? 'rgba(9,105,218,.3)' : 'var(--c-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: social[key] ? 'var(--c-blue)' : 'var(--c-muted)', transition: 'all .2s' }}>
                  <Icon size={17} strokeWidth={1.75} />
                </div>
                {/* Input */}
                <div style={{ flex: 1 }}>
                  <label style={{ ...lbl, marginBottom: 4 }}>{label}</label>
                  <input
                    type="text"
                    style={inp}
                    value={social[key] ?? ''}
                    placeholder={ph}
                    onChange={(e) => setSocial(key, e.target.value)}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')}
                  />
                </div>
                {/* Badge actif */}
                {social[key] && (
                  <div style={{ flexShrink: 0, width: 8, height: 8, borderRadius: '50%', background: 'var(--c-green)', marginTop: 18 }} title="Lien actif" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Save ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="submit" disabled={status === 'saving'} className="btn-primary"
            style={{ opacity: status === 'saving' ? 0.6 : 1 }}>
            <Save size={15} /> {status === 'saving' ? 'Enregistrement...' : 'Enregistrer le profil'}
          </button>
          {status === 'saved' && (
            <span style={{ fontSize: '0.82rem', color: 'var(--c-green)', background: 'rgba(26,127,55,.08)', border: '1px solid rgba(26,127,55,.2)', borderRadius: 6, padding: '4px 10px' }}>
              Profil mis à jour
            </span>
          )}
        </div>
      </form>
    </AdminShell>
  );
}
