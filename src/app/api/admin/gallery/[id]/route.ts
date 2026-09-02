import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { queryOne } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional().nullable(),
  image_url: z.string().url().optional(),
  category: z.string().min(1).max(100).optional(),
  order_index: z.number().int().optional(),
  published: z.boolean().optional(),
});

async function requireAuth() {
  const session = await getServerSession(authOptions);
  return !!session;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const fields = parsed.data;
  const sets: string[] = [];
  const vals: unknown[] = [];
  let n = 1;
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined) { sets.push(`${k} = $${n++}`); vals.push(v); }
  }
  if (sets.length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  vals.push(params.id);
  const item = await queryOne(
    `UPDATE gallery SET ${sets.join(', ')} WHERE id = $${n} RETURNING *`,
    vals as any[]
  );
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await queryOne('DELETE FROM gallery WHERE id = $1', [params.id]);
  return new NextResponse(null, { status: 204 });
}
