'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Check, X, Trash2, Star } from 'lucide-react';
import type { Review } from '@/types';

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  async function load() {
    const res = await fetch('/api/admin/reviews');
    const data = await res.json();
    setReviews(data.reviews ?? []);
  }
  useEffect(() => { load(); }, []);

  async function togglePublish(id: number, published: boolean) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published })
    });
    load();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <AdminShell title="Avis">
      <div className="flex flex-col gap-3">
        {reviews.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-lg border border-border-light p-4 dark:border-border-dark">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{r.full_name}</p>
                <span className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={12} strokeWidth={1.75}
                      className={n <= r.rating ? 'fill-primary text-primary' : 'fill-transparent text-border-light dark:text-border-dark'} />
                  ))}
                </span>
                <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${r.published ? 'bg-primary/10 text-primary' : 'bg-canvas-light text-muted-light dark:bg-canvas-dark dark:text-muted-dark'}`}>
                  {r.published ? 'publie' : 'en attente'}
                </span>
              </div>
              <p className="mt-1 max-w-xl text-xs text-muted-light dark:text-muted-dark">{r.message}</p>
            </div>
            <div className="flex items-center gap-1">
              {!r.published && (
                <button type="button" onClick={() => togglePublish(r.id, true)} aria-label="Publier"
                  className="rounded-md p-2 text-muted-light hover:bg-primary/10 hover:text-primary dark:text-muted-dark">
                  <Check size={16} strokeWidth={1.75} />
                </button>
              )}
              {r.published && (
                <button type="button" onClick={() => togglePublish(r.id, false)} aria-label="Depublier"
                  className="rounded-md p-2 text-muted-light hover:bg-canvas-light hover:text-ink-light dark:text-muted-dark">
                  <X size={16} strokeWidth={1.75} />
                </button>
              )}
              <button type="button" onClick={() => handleDelete(r.id)} aria-label="Supprimer"
                className="rounded-md p-2 text-muted-light hover:bg-red-50 hover:text-red-600 dark:text-muted-dark">
                <Trash2 size={16} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-muted-light dark:text-muted-dark">Aucun avis.</p>}
      </div>
    </AdminShell>
  );
}
