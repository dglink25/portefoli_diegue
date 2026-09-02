'use client';

import { useState } from 'react';
import { Send, Mail, Phone, MapPin, Clock } from 'lucide-react';
import type { Profile } from '@/types';

export function ContactSection({ profile }: { profile: Profile | null }) {
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'err'>('idle');
  const email   = profile?.email    || 'dondiegue21@gmail.com';
  const phone   = '+229 01 94 11 94 76';
  const loc     = profile?.location || 'Lokossa, Bénin';
  const social  = (profile?.social_links ?? {}) as Record<string,string>;
  const waHref  = social.whatsapp || `https://wa.me/22901941194`;

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
    <section id="contact" style={{ padding: '5rem 0', borderTop: '1px solid var(--c-border)', background: 'var(--c-bg3)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div className="reveal" style={{ marginBottom: '3rem' }}>
          <p className="sec-label">CONTACT</p>
          <h2 className="sec-title">Contactez-moi</h2>
          <div className="sec-divider" />
          <p style={{ fontSize: '0.9rem', color: 'var(--c-muted)' }}>Un projet, une opportunité, une question ? Écrivez-moi, je réponds rapidement.</p>
        </div>

        <div className="reveal contact-grid">
          {/* Info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Contact details */}
            <div style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--c-ink)', marginBottom: '1.25rem' }}>Informations de contact</h3>
              {[
                { Icon: Mail,  label: 'EMAIL',              val: email,   href: `mailto:${email}` },
                { Icon: Phone, label: 'TÉLÉPHONE / WHATSAPP', val: phone,   href: waHref },
                { Icon: MapPin,label: 'LOCALISATION',       val: loc,          href: null },
                { Icon: Clock, label: 'DISPONIBILITÉ',      val: 'Télétravail ou présentiel', href: null },
              ].map(({ Icon, label, val, href }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: '1rem' }}>
                  <div style={{ width: 36, height: 36, flexShrink: 0, background: 'rgba(9,105,218,0.08)', border: '1px solid rgba(9,105,218,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-blue)' }}>
                    <Icon size={15} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--c-muted)', marginBottom: 2 }}>{label}</p>
                    {href
                      ? <a href={href} style={{ fontSize: '0.86rem', fontWeight: 500, color: 'var(--c-ink)', textDecoration: 'none', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c-blue)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c-ink)')}>{val}</a>
                      : <p style={{ fontSize: '0.86rem', fontWeight: 500, color: 'var(--c-ink)' }}>{val}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* CTA card */}
            <div style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--c-ink)', marginBottom: '0.5rem' }}>Travaillons ensemble</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--c-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>Disponible pour des missions freelance, des projets collaboratifs ou simplement échanger sur la tech.</p>
              <a href={`mailto:${email}`} className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.6rem 1.25rem' }}>
                <Mail size={14} /> Envoyer un email
              </a>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 14, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--c-ink)' }}>Envoyer un message</h3>

            <div className="contact-form-row">
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Nom complet</label>
                <input name="full_name" required maxLength={100} className="inp" placeholder="Votre nom" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Email</label>
                <input name="email" type="email" required className="inp" placeholder="email@exemple.com" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Sujet</label>
              <input name="subject" maxLength={150} className="inp" placeholder="Objet de votre message" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Message</label>
              <textarea name="message" required rows={5} maxLength={2000} className="inp" style={{ resize: 'none' }} placeholder="Décrivez votre projet ou votre question..." />
            </div>

            <button type="submit" disabled={status === 'loading'} className="btn-primary" style={{ justifyContent: 'center', opacity: status === 'loading' ? 0.6 : 1 }}>
              <Send size={15} /> {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>

            {status === 'ok' && (
              <div style={{ background: 'rgba(26,127,55,0.1)', border: '1px solid rgba(26,127,55,0.3)', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.82rem', color: 'var(--c-green)' }}>
                Message envoyé avec succès. Je vous répondrai dans les plus brefs délais.
              </div>
            )}
            {status === 'err' && (
              <div style={{ background: 'rgba(207,34,46,0.08)', border: '1px solid rgba(207,34,46,0.3)', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#cf222e' }}>
                Une erreur est survenue. Veuillez réessayer ou m&apos;écrire directement par email.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
