'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { StarRating } from './star-rating';

export function ReviewForm() {
  const t = useTranslations('reviews');
  const router = useRouter();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name, message, rating })
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
      setName('');
      setMessage('');
      setRating(5);
      router.refresh();
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-border-light p-6 dark:border-border-dark">
      <h3 className="font-display text-base font-semibold">{t('leave')}</h3>

      <div>
        <label htmlFor="review-rating" className="mb-1.5 block text-sm font-medium">
          {t('rating')}
        </label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <label htmlFor="review-name" className="mb-1.5 block text-sm font-medium">
          {t('name')}
        </label>
        <input
          id="review-name"
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('namePlaceholder')}
          className="w-full rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark"
        />
      </div>

      <div>
        <label htmlFor="review-message" className="mb-1.5 block text-sm font-medium">
          {t('message')}
        </label>
        <textarea
          id="review-message"
          required
          maxLength={600}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('messagePlaceholder')}
          className="w-full resize-none rounded-md border border-border-light bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {t('submit')}
      </button>

      {status === 'success' && <p className="text-sm text-primary">{t('submitted')}</p>}
      {status === 'error' && <p className="text-sm text-red-600">{t('error')}</p>}
    </form>
  );
}
