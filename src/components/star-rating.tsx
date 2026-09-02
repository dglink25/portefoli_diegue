'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, size = 20, readOnly }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5" role={readOnly ? undefined : 'radiogroup'}>
      {stars.map((s) => {
        const filled = s <= Math.round(value);
        return (
          <button
            key={s}
            type="button"
            disabled={readOnly}
            aria-label={`${s} sur 5`}
            aria-pressed={filled}
            onClick={() => onChange?.(s)}
            className={readOnly ? 'cursor-default' : 'cursor-pointer'}
          >
            <Star
              size={size}
              strokeWidth={1.75}
              className={filled ? 'fill-primary text-primary' : 'fill-transparent text-muted-light dark:text-muted-dark'}
            />
          </button>
        );
      })}
    </div>
  );
}
