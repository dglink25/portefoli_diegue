import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const postSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  message:   z.string().trim().min(3).max(600),
  // rating optionnel à la soumission (on peut laisser sans note initiale)
  rating:    z.number().int().min(1).max(5).optional().default(5),
});

export async function GET() {
  // Récupère les avis avec le total de notes et la moyenne des notes tierces
  const reviews = await query(`
    SELECT
      r.id, r.full_name, r.message, r.rating, r.created_at,
      COALESCE(AVG(rr.rating), NULL)::float  AS peer_avg,
      COUNT(rr.id)::int                       AS peer_count
    FROM reviews r
    LEFT JOIN review_ratings rr ON rr.review_id = r.id
    WHERE r.published = true
    GROUP BY r.id
    ORDER BY r.created_at DESC
  `);
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });

  const { full_name, message, rating } = parsed.data;
  await query(
    'INSERT INTO reviews (full_name, message, rating, published) VALUES ($1, $2, $3, true)',
    [full_name, message, rating]
  );
  return NextResponse.json({ ok: true }, { status: 201 });
}
