'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError('Identifiants incorrects.');
      return;
    }
    router.push('/admin/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-light px-6 dark:bg-canvas-dark">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-border-light bg-surface-light p-8 dark:border-border-dark dark:bg-surface-dark">
        <p className="font-display text-lg font-semibold">Backoffice</p>
        <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">Connectez-vous pour gerer le contenu du portfolio.</p>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Mot de passe</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50">
            <LogIn size={16} strokeWidth={1.75} /> Se connecter
          </button>
        </div>
      </form>
    </div>
  );
}
