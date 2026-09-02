'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogIn, Eye, EyeOff } from 'lucide-react';

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--c-bg3)', border: '1px solid var(--c-border)',
  borderRadius: 8, color: 'var(--c-ink)', padding: '0.7rem 1rem',
  fontSize: '0.875rem', fontFamily: 'var(--ff-body)', outline: 'none', transition: 'border-color .2s',
};

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setError('Email ou mot de passe incorrect.'); return; }
    router.push('/admin/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--c-bg)', padding: '1.5rem' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400, background: 'var(--c-bg2)', border: '1px solid var(--c-border)', borderRadius: 16, padding: '2.5rem 2rem', boxShadow: '0 4px 24px var(--c-shadow)' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.75rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--c-blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: '1rem', color: '#fff', flexShrink: 0 }}>DH</div>
          <div>
            <p style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--c-ink)' }}>Backoffice</p>
            <p style={{ fontSize: '.75rem', color: 'var(--c-muted)' }}>Connectez-vous pour gérer le portfolio</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Email</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inp}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: 'var(--c-muted)', marginBottom: 6 }}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input id="password" type={showPwd ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ ...inp, paddingRight: '2.75rem' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--c-blue)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--c-border)')} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-muted)', display: 'flex', alignItems: 'center' }}>
                {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(207,34,46,.08)', border: '1px solid rgba(207,34,46,.3)', borderRadius: 8, padding: '.6rem .875rem', fontSize: '.82rem', color: '#cf222e' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '.8rem 1.5rem', background: 'var(--c-blue-dim)', color: '#fff', fontFamily: 'var(--ff-body)', fontSize: '.875rem', fontWeight: 600, border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .6 : 1, transition: 'all .2s', marginTop: 4 }}>
            <LogIn size={16}/> {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </form>
    </div>
  );
}
