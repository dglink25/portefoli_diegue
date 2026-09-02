import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';
import { projectSchema } from '@/lib/validators';

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const projects = await query('SELECT * FROM projects ORDER BY order_index ASC, created_at DESC');
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_payload', issues: parsed.error.issues }, { status: 400 });
  }

  const p = parsed.data;
  const [project] = await query(
    `INSERT INTO projects
      (slug, title_fr, title_en, description_fr, description_en, cover_image, tags, demo_url, repo_url, featured, published, order_index)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [
      p.slug, p.title_fr, p.title_en, p.description_fr, p.description_en,
      p.cover_image || null, p.tags, p.demo_url || null, p.repo_url || null,
      p.featured, p.published, p.order_index
    ]
  );

  return NextResponse.json({ project }, { status: 201 });
}
