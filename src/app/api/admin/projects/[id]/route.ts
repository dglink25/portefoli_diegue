import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';
import { projectSchema } from '@/lib/validators';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_payload', issues: parsed.error.issues }, { status: 400 });
  }

  const fields = parsed.data;
  const entries = Object.entries(fields).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return NextResponse.json({ error: 'empty_payload' }, { status: 400 });

  const setClause = entries.map(([key], i) => `${key} = $${i + 2}`).join(', ');
  const values = entries.map(([, v]) => v);

  const [project] = await query(
    `UPDATE projects SET ${setClause}, updated_at = now() WHERE id = $1 RETURNING *`,
    [params.id, ...values]
  );

  if (!project) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ project });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  await query('DELETE FROM projects WHERE id = $1', [params.id]);
  return NextResponse.json({ ok: true });
}
