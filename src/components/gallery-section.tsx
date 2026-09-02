'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem { id: number; title: string; description: string | null; image_url: string; category: string; }

export function GallerySection({ items }: { items: GalleryItem[] }) {
  const [cat, setCat] = useState('Tout');
  const [lb, setLb] = useState<number | null>(null);
  if (items.length === 0) return null;
  const cats = ['Tout', ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = cat === 'Tout' ? items : items.filter((i) => i.category === cat);

  return (
    <section id="gallery" style={{ padding: '5rem 0', borderTop: '1px solid var(--c-border)', background: 'var(--c-bg2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div className="reveal" style={{ marginBottom: '2.5rem' }}>
          <p className="sec-label">GALERIE</p>
          <h2 className="sec-title">Mes souvenirs & moments</h2>
          <div className="sec-divider" />
        </div>

        {/* Filters */}
        <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '2rem' }}>
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} style={{ padding: '6px 16px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600, border: `1px solid ${cat === c ? 'var(--c-blue)' : 'var(--c-border)'}`, background: cat === c ? 'var(--c-blue-dim)' : 'transparent', color: cat === c ? '#fff' : 'var(--c-muted)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--ff-body)' }}>
              {c}
            </button>
          ))}
        </div>

        {/* Masonry */}
        <div className="reveal" style={{ columns: 'auto', columnWidth: 220, gap: '1rem' }}>
          {filtered.map((item, idx) => (
            <div key={item.id} onClick={() => setLb(idx)} style={{ breakInside: 'avoid', marginBottom: '1rem', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--c-border)', cursor: 'pointer', position: 'relative', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image_url} alt={item.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '1.5rem 0.75rem 0.75rem', transform: 'translateY(100%)', transition: 'transform 0.3s' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(100%)')}>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lb !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLb(null)}>
          <button onClick={(e) => { e.stopPropagation(); setLb((lb - 1 + filtered.length) % filtered.length); }} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={22} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLb((lb + 1) % filtered.length); }} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronRight size={22} />
          </button>
          <button onClick={() => setLb(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '80vw', maxHeight: '85vh', textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={filtered[lb].image_url} alt={filtered[lb].title} style={{ maxWidth: '100%', maxHeight: '78vh', borderRadius: 12, objectFit: 'contain' }} />
            <p style={{ marginTop: 12, fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{filtered[lb].title}</p>
          </div>
        </div>
      )}
    </section>
  );
}
