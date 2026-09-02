import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-options';

// Verifie la session admin pour les routes API du backoffice. Renvoie
// `null` si autorise, sinon une reponse 401 a retourner telle quelle.
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return null;
}
