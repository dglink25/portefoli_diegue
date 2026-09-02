import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { reviewSchema } from '@/lib/validators';

// GET /api/reviews -> avis publies (utilise par le site public)
export async function GET() {
  const reviews = await query(
    'SELECT id, full_name, message, rating, created_at FROM reviews WHERE published = true ORDER BY created_at DESC'
  );
  return NextResponse.json({ reviews });
}

// POST /api/reviews -> un visiteur soumet un avis. Il reste invisible
// (published = false) jusqu'a validation par l'admin dans le backoffice,
// afin d'eviter le spam.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const { full_name, message, rating } = parsed.data;
  await query(
    'INSERT INTO reviews (full_name, message, rating, published) VALUES ($1, $2, $3, false)',
    [full_name, message, rating]
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
