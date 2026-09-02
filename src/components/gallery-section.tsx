'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface GalleryItem {
  id: number; title: string; description: string | null;
  image_url: string; category: string;
}

export function GallerySection({ items }: { items: GalleryItem[] }) {
  const [cat, setCat]   = useState('Tout');
  const [lb, setLb]     = useState<number | null>(null);
  if (items.length === 0) return null;

  const cats     = ['Tout', ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = cat === 'Tout' ? items : items.filter((i) => i.category === cat);

  return (
    <section id="gallery" style={{ padding: '5rem 0', borderTop: '1px solid var(--c-border)', background: 'var(--c-bg3)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div className="reveal" style={{ marginBottom: '2.5rem' }}>
          <p className="sec-label">GALERIE</p>
          <h2 className="sec-title">Mes souvenirs &amp; moments</h2>
          <div className="sec-divider" />
        </div>

        {/* Filters */}
        <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '2rem' }}>
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '5px 16px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
              border: `1px solid ${cat === c ? 'var(--c-blue)' : 'var(--c-border)'}`,
              background: cat === c ? 'var(--c-blue-dim)' : 'transparent',
              color: cat === c ? '#fff' : 'var(--c-muted)',
              cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--ff-body)',
            }}>
              {c}
            </button>
          ))}
        </div>

        {/* Masonry */}
        <div className="gallery-masonry reveal">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLb(idx)}
              style={{ breakInside: 'avoid', marginBottom: '1rem', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--c-border)', cursor: 'pointer', position: 'relative', transition: 'transform 0.25s, box-shadow 0.25s' }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 6px 20px var(--c-shadow)'; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image_url} alt={item.title} style={{ width: '100%', height: 'auto', display: 'block' }} />

              {/* Hover overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.25s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.35)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0)')}>
                <ZoomIn size={26} style={{ color: '#fff', opacity: 0, transition: 'opacity 0.25s' }}
                  onMouseEnter={(e) => ((e.currentTarget as SVGElement).style.opacity = '1')}
                  onMouseLeave={(e) => ((e.currentTarget as SVGElement).style.opacity = '0')} />
              </div>

              {/* Caption */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)', padding: '1.5rem 0.75rem 0.75rem', transform: 'translateY(100%)', transition: 'transform 0.3s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(100%)')}>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>{item.title}</p>
                {item.description && <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lb !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setLb(null)}>

          <button onClick={(e) => { e.stopPropagation(); setLb((lb - 1 + filtered.length) % filtered.length); }}
            style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
            <ChevronLeft size={22} />
          </button>

          <button onClick={(e) => { e.stopPropagation(); setLb((lb + 1) % filtered.length); }}
            style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
            <ChevronRight size={22} />
          </button>

          <button onClick={() => setLb(null)}
            style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>

          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '80vw', maxHeight: '85vh', textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={filtered[lb].image_url} alt={filtered[lb].title} style={{ maxWidth: '100%', maxHeight: '78vh', borderRadius: 12, objectFit: 'contain' }} />
            <p style={{ marginTop: 12, fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{filtered[lb].title}</p>
            {filtered[lb].description && <p style={{ marginTop: 4, fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>{filtered[lb].description}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
