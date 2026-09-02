import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';
import { skillSchema } from '@/lib/validators';

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const skills = await query('SELECT * FROM skills ORDER BY order_index ASC, name ASC');
  return NextResponse.json({ skills });
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = skillSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });

  const s = parsed.data;
  const [skill] = await query(
    'INSERT INTO skills (name, category, level, icon, order_index) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [s.name, s.category, s.level, s.icon || null, s.order_index]
  );
  return NextResponse.json({ skill }, { status: 201 });
}
