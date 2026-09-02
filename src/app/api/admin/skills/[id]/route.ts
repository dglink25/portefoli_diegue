import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';
import { skillSchema } from '@/lib/validators';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = skillSchema.partial().safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'invalid_payload', issues: parsed.error.issues }, { status: 400 });

  const entries = Object.entries(parsed.data).filter(([, v]) => v !== undefined);
  if (entries.length === 0)
    return NextResponse.json({ error: 'empty_payload' }, { status: 400 });

  const setClause = entries.map(([key], i) => `${key} = $${i + 2}`).join(', ');
  const values    = entries.map(([, v]) => v);

  const skill = await queryOne(
    `UPDATE skills SET ${setClause} WHERE id = $1 RETURNING *`,
    [params.id, ...values]
  );
  if (!skill) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ skill });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  await query('DELETE FROM skills WHERE id = $1', [params.id]);
  return NextResponse.json({ ok: true });
}
