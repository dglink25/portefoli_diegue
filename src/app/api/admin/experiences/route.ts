import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';
import { experienceSchema } from '@/lib/validators';

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const experiences = await query('SELECT * FROM experiences ORDER BY start_date DESC');
  return NextResponse.json({ experiences });
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = experienceSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });

  const e = parsed.data;
  const [experience] = await query(
    `INSERT INTO experiences (title_fr, title_en, company, location, description_fr, description_en, start_date, end_date, order_index)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [e.title_fr, e.title_en, e.company, e.location || null, e.description_fr, e.description_en, e.start_date, e.end_date || null, e.order_index]
  );
  return NextResponse.json({ experience }, { status: 201 });
}
