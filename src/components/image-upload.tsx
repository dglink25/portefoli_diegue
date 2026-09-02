'use client';

import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  aspectRatio?: 'square' | 'wide' | 'portrait';
}

export function ImageUpload({
  value,
  onChange,
  label = 'Image',
  placeholder = 'https://... ou choisir un fichier',
  aspectRatio = 'wide',
}: Props) {
  const fileRef  = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');

  const heights: Record<string, number> = { square: 160, wide: 120, portrait: 200 };

  async function handleFile(file: File) {
    setUploading(true); setError('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Erreur upload'); return; }
      onChange(json.url);
    } catch {
      setError('Erreur réseau lors de l\'upload.');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const inp: React.CSSProperties = {
    width: '100%', background: 'var(--c-bg3)', border: '1px solid var(--c-border)',
    borderRadius: 8, color: 'var(--c-ink)', padding: '0.65rem 1rem',
    fontSize: '0.84rem', fontFamily: 'var(--ff-body)', outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && (
        <label style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--c-muted)' }}>
          {label}
        </label>
      )}

      {/* Drop zone / preview */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !value && fileRef.current?.click()}
        style={{
          borderRadius: 10, border: `2px dashed ${value ? 'var(--c-border)' : 'var(--c-blue)'}`,
          background: value ? 'transparent' : 'rgba(9,105,218,0.03)',
          height: heights[aspectRatio], overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: value ? 'default' : 'pointer', position: 'relative',
          transition: 'border-color 0.2s',
        }}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={13} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
              style={{ position: 'absolute', bottom: 6, right: 6, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#fff', fontSize: '0.7rem', fontFamily: 'var(--ff-body)' }}
            >
              <Upload size={11} /> Changer
            </button>
          </>
        ) : uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--c-muted)' }}>
            <Loader2 size={24} style={{ animation: 'spin-slow 1s linear infinite' }} />
            <span style={{ fontSize: '0.78rem' }}>Upload en cours...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--c-muted)', pointerEvents: 'none' }}>
            <Upload size={22} style={{ color: 'var(--c-blue)' }} />
            <span style={{ fontSize: '0.78rem', textAlign: 'center' }}>
              Glissez une image ici<br />
              <span style={{ color: 'var(--c-blue)', fontWeight: 600 }}>ou cliquez pour choisir</span>
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--c-muted)' }}>JPG · PNG · WebP · GIF · max 5 Mo</span>
          </div>
        )}
      </div>

      {/* URL input */}
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="url"
          value={value}
          onChange={(e) => { setError(''); onChange(e.target.value); }}
          placeholder={placeholder}
          style={inp}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          title="Choisir un fichier"
          style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 8, border: '1px solid var(--c-border)', background: 'var(--c-bg3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-muted)', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = 'var(--c-blue)'; el.style.color = 'var(--c-blue)'; }}
          onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = 'var(--c-border)'; el.style.color = 'var(--c-muted)'; }}
        >
          <Upload size={15} />
        </button>
      </div>

      {error && (
        <p style={{ fontSize: '0.75rem', color: '#cf222e', background: 'rgba(207,34,46,0.06)', border: '1px solid rgba(207,34,46,0.2)', borderRadius: 6, padding: '0.4rem 0.6rem' }}>
          {error}
        </p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}
