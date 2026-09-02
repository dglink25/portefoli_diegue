'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import type { Review } from '@/types';
import { StarRating } from './star-rating';

function fmt(d: string, l: string) { return new Intl.DateTimeFormat(l, { year: 'numeric', month: 'long' }).format(new Date(d)); }

export function ReviewsSection({ reviews, locale }: { reviews: Review[]; locale: string }) {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'err'>('idle');
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setStatus('loading');
    try {
      const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ full_name: name, message: msg, rating }) });
      if (!res.ok) throw new Error();
      setStatus('ok'); setName(''); setMsg(''); setRating(5);
    } catch { setStatus('err'); }
  }

  return (
    <section id="reviews" style={{ padding: '5rem 0', borderTop: '1px solid var(--c-border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div className="reveal" style={{ marginBottom: '3rem' }}>
          <p className="sec-label">TÉMOIGNAGES</p>
          <h2 className="sec-title">Avis</h2>
          <div className="sec-divider" />
        </div>

        {reviews.length > 0 && (
          <div className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '1rem 1.5rem', marginBottom: '2rem' }}>
            <span style={{ fontFamily: 'var(--ff-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--c-blue)' }}>{avg.toFixed(1)}</span>
            <div>
              <StarRating value={avg} readOnly size={18} />
              <p style={{ fontSize: '0.75rem', color: 'var(--c-muted)', marginTop: 4 }}>{reviews.length} avis · sur 5</p>
            </div>
          </div>
        )}

        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,380px)', gap: '2rem', alignItems: 'start' }}>
          {/* Reviews list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.length === 0
              ? <p style={{ fontSize: '0.9rem', color: 'var(--c-muted)' }}>Soyez le premier à laisser un avis.</p>
              : reviews.map((r, i) => (
                <div key={r.id} style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '1.25rem', transition: 'border-color 0.2s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(88,166,255,0.35)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--c-border)'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(88,166,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ff-display)', fontWeight: 700, color: 'var(--c-blue)' }}>
                        {r.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--c-ink)' }}>{r.full_name}</p>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[1,2,3,4,5].map((n) => <Star key={n} size={11} style={{ fill: n <= r.rating ? 'var(--c-blue)' : 'transparent', color: n <= r.rating ? 'var(--c-blue)' : 'var(--c-border)' }} />)}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--c-muted)', flexShrink: 0 }}>{fmt(r.created_at, locale)}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--c-muted)' }}>{r.message}</p>
                </div>
              ))
            }
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 14, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: 80 }}>
            <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--c-ink)' }}>Laisser un avis</h3>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 8 }}>Note</label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Nom complet</label>
              <input required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} placeholder="Jean Dupont" className="inp" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Message</label>
              <textarea required rows={4} maxLength={600} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Partagez votre expérience..." className="inp" style={{ resize: 'none' }} />
            </div>
            <button type="submit" disabled={status === 'loading'} className="btn-primary" style={{ justifyContent: 'center', opacity: status === 'loading' ? 0.6 : 1 }}>
              {status === 'loading' ? 'Envoi...' : 'Publier l\'avis'}
            </button>
            {status === 'ok' && <p style={{ fontSize: '0.8rem', color: 'var(--c-green)' }}>✓ Merci ! Votre avis sera visible après validation.</p>}
            {status === 'err' && <p style={{ fontSize: '0.8rem', color: '#f87171' }}>Erreur. Veuillez réessayer.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
