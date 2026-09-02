'use client';

import { useState } from 'react';

export function ContactSection() {
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'err'>('idle');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus('loading');
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      setStatus('ok'); (e.target as HTMLFormElement).reset();
    } catch { setStatus('err'); }
  }

  return (
    <section id="contact" style={{ padding: '5rem 0', borderTop: '1px solid var(--c-border)', background: 'var(--c-bg2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div className="reveal" style={{ marginBottom: '3rem' }}>
          <p className="sec-label">CONTACT</p>
          <h2 className="sec-title">Contactez-moi</h2>
          <div className="sec-divider" />
          <p style={{ fontSize: '0.9rem', color: 'var(--c-muted)' }}>Un projet, une opportunité, une question ? Écrivez-moi, je réponds rapidement.</p>
        </div>

        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)', gap: '3rem', alignItems: 'start' }}>
          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'var(--c-bg3)', border: '1px solid var(--c-border)', borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--c-ink)', marginBottom: '1.25rem' }}>Informations de contact</h3>
              {[
                { icon: '✉️', label: 'EMAIL', val: 'dondiegue21@gmail.com', href: 'mailto:dondiegue21@gmail.com' },
                { icon: '📞', label: 'TÉLÉPHONE / WHATSAPP', val: '+229 01 94 11 94 76', href: 'tel:+22901941194' },
                { icon: '📍', label: 'LOCALISATION', val: 'Lokossa, Bénin', href: null },
                { icon: '💼', label: 'DISPONIBILITÉ', val: 'Télétravail ou présentiel', href: null },
              ].map(({ icon, label, val, href }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: '1rem' }}>
                  <div style={{ width: 36, height: 36, flexShrink: 0, background: 'rgba(88,166,255,0.08)', border: '1px solid rgba(88,166,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.9rem' }}>{icon}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-muted)', marginBottom: 2 }}>{label}</p>
                    {href
                      ? <a href={href} style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--c-ink)', textDecoration: 'none', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c-blue)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c-ink)')}>{val}</a>
                      : <p style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--c-ink)' }}>{val}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Travaillons ensemble */}
            <div style={{ background: 'var(--c-bg3)', border: '1px solid var(--c-border)', borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--c-ink)', marginBottom: '0.5rem' }}>Travaillons ensemble</h3>
              <p style={{ fontSize: '0.83rem', color: 'var(--c-muted)', marginBottom: '1rem' }}>Disponible pour des missions freelance, des projets collaboratifs ou simplement échanger sur la tech.</p>
              <a href="mailto:dondiegue21@gmail.com" className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.6rem 1.25rem' }}>
                Envoyer un email →
              </a>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ background: 'var(--c-bg3)', border: '1px solid var(--c-border)', borderRadius: 14, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--c-ink)' }}>Envoyer un message</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Nom complet</label>
                <input name="full_name" required maxLength={100} className="inp" placeholder="Votre nom" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Votre email</label>
                <input name="email" type="email" required className="inp" placeholder="email@exemple.com" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Sujet</label>
              <input name="subject" maxLength={150} className="inp" placeholder="Objet de votre message" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Votre message</label>
              <textarea name="message" required rows={5} maxLength={2000} className="inp" style={{ resize: 'none' }} placeholder="Décrivez votre projet..." />
            </div>

            <button type="submit" disabled={status === 'loading'} className="btn-primary" style={{ justifyContent: 'center', opacity: status === 'loading' ? 0.6 : 1 }}>
              {status === 'loading' ? 'Envoi...' : 'Envoyer le message'}
            </button>
            {status === 'ok' && <p style={{ fontSize: '0.82rem', color: 'var(--c-green)' }}>✓ Message envoyé avec succès !</p>}
            {status === 'err' && <p style={{ fontSize: '0.82rem', color: '#f87171' }}>Erreur. Veuillez réessayer.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
