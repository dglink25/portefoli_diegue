import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  if (typeof body?.published !== 'boolean') {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const [review] = await query('UPDATE reviews SET published = $2 WHERE id = $1 RETURNING *', [params.id, body.published]);
  if (!review) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ review });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  await query('DELETE FROM reviews WHERE id = $1', [params.id]);
  return NextResponse.json({ ok: true });
}
