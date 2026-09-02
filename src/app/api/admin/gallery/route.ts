import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { query, queryOne } from '@/lib/db';
import { z } from 'zod';

/* Accepte URL absolue ou chemin relatif /uploads/... */
const imageUrlField = z.string().trim().min(1).refine(
  (v) => v.startsWith('/') || v.startsWith('http://') || v.startsWith('https://'),
  { message: 'Chemin image invalide' }
);

const schema = z.object({
  title:       z.string().min(1).max(200),
  description: z.string().max(500).optional().nullable(),
  image_url:   imageUrlField,
  category:    z.string().min(1).max(100).default('general'),
  order_index: z.number().int().default(0),
  published:   z.boolean().default(true),
});

async function requireAuth() {
  const session = await getServerSession(authOptions);
  return !!session;
}

export async function GET() {
  if (!(await requireAuth()))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = await query('SELECT * FROM gallery ORDER BY order_index ASC, id ASC');
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  if (!(await requireAuth()))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { title, description, image_url, category, order_index, published } = parsed.data;
  const item = await queryOne(
    'INSERT INTO gallery (title, description, image_url, category, order_index, published) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [title, description ?? null, image_url, category, order_index, published]
  );
  return NextResponse.json(item, { status: 201 });
}
