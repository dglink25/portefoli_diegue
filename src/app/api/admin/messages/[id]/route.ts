import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const body = await req.json().catch(() => ({}));
  const msg = await queryOne(
    'UPDATE messages SET read = $1 WHERE id = $2 RETURNING *',
    [body.read ?? true, params.id]
  );
  if (!msg) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(msg);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  await query('DELETE FROM messages WHERE id = $1', [params.id]);
  return new NextResponse(null, { status: 204 });
}
