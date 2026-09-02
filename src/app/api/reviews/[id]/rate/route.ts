import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
  voter_name: z.string().trim().min(2).max(80),
  rating:     z.number().int().min(1).max(5),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { voter_name, rating } = parsed.data;
  const reviewId = Number(params.id);

  // Vérifie que l'avis existe et est publié
  const review = await queryOne('SELECT id FROM reviews WHERE id = $1 AND published = true', [reviewId]);
  if (!review)
    return NextResponse.json({ error: 'Avis introuvable.' }, { status: 404 });

  const ratingRow = await queryOne(
    'INSERT INTO review_ratings (review_id, voter_name, rating) VALUES ($1, $2, $3) RETURNING *',
    [reviewId, voter_name, rating]
  );

  return NextResponse.json(ratingRow, { status: 201 });
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const rows = await query(
    'SELECT voter_name, rating, created_at FROM review_ratings WHERE review_id = $1 ORDER BY created_at DESC',
    [params.id]
  );
  const avg = rows.length
    ? rows.reduce((s: number, r: any) => s + r.rating, 0) / rows.length
    : 0;
  return NextResponse.json({ ratings: rows, average: avg, count: rows.length });
}
