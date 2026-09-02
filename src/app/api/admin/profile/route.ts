import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const profile = await queryOne('SELECT * FROM profile WHERE id = 1');
  return NextResponse.json({ profile });
}

export async function PUT(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });

  const fields = [
    'full_name', 'title_fr', 'title_en', 'bio_fr', 'bio_en',
    'avatar_url', 'hero_image_url', 'email', 'location', 'social_links'
  ];
  const entries = fields.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]);
  if (entries.length === 0) return NextResponse.json({ error: 'empty_payload' }, { status: 400 });

  const setClause = entries.map(([key], i) => `${key} = $${i + 1}`).join(', ');
  const values = entries.map(([, v]) => v);

  const [profile] = await query(
    `UPDATE profile SET ${setClause}, updated_at = now() WHERE id = 1 RETURNING *`,
    values
  );
  return NextResponse.json({ profile });
}
