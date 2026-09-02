# Portfolio — Next.js + PostgreSQL

Site portfolio avec backoffice integre, 100% Next.js (App Router, frontend + API routes)
et une base PostgreSQL versionnee par migrations.

> **Note :** ce projet cible Next.js 14.2.35 (dernier correctif de securite de la ligne 14,
> qui est en fin de support depuis le 26/10/2025). Pour un projet destine a rester en ligne
> longtemps, prevoyez une migration vers Next.js 15 (LTS de maintenance) apres la mise en route.

## Stack

- **Next.js 14** (App Router) — frontend et backend (API routes) dans le meme projet
- **PostgreSQL** + **node-pg-migrate** — schema evolutif, chaque changement = une migration versionnee
- **NextAuth (Credentials)** — authentification email/mot de passe pour le backoffice
- **next-intl** — i18n FR (par defaut) / EN, changeable par le visiteur
- **next-themes** — theme clair (par defaut) / sombre, changeable par le visiteur
- **lucide-react** — icones vectorielles (aucun emoji, aucun degrade)
- **three.js** — animation du hero en instancing dynamique (grille de formes animees en temps reel)
- **Docker / docker-compose** — l'ensemble du projet (app + base de donnees) est conteneurise

## Demarrage avec Docker (recommande)

```bash
cp .env.example .env
# Editez .env : mot de passe Postgres, NEXTAUTH_SECRET (openssl rand -base64 32),
# ADMIN_EMAIL / ADMIN_PASSWORD pour le premier compte backoffice.

docker compose up --build -d      # build + lance db, migrations, app
docker compose exec app npm run seed   # cree le compte admin (une seule fois)
```

L'app est disponible sur http://localhost:3000, le backoffice sur http://localhost:3000/admin/login.

## Demarrage en local (sans tout conteneuriser)

```bash
npm install
docker compose -f docker-compose.dev.yml up -d   # uniquement Postgres
cp .env.example .env                              # DATABASE_URL -> localhost
npm run migrate:up
npm run seed
npm run dev
```

## Structure

```
migrations/           Migrations SQL versionnees (node-pg-migrate)
src/app/[locale]/     Pages publiques (FR/EN)
src/app/admin/        Backoffice (protege par NextAuth)
src/app/api/          Routes API (publiques + /api/admin/* protegees)
src/components/       Composants UI partages
src/i18n/              Config next-intl + fichiers de traduction
src/lib/               DB, auth, validation
```

## Faire evoluer la base de donnees

Chaque changement de schema est une nouvelle migration, jamais une modification d'une migration existante :

```bash
npm run migrate:create nom-du-changement
# editer le fichier genere dans migrations/
npm run migrate:up
```

## Personnalisation

- Couleur principale et couleur du footer : `tailwind.config.ts` (`primary`, `footer`) et `src/app/globals.css`.
- Theme par defaut et autorisation du changement de theme par le visiteur : table `settings` (cle `theme`), modifiable depuis `/admin/settings`.
- Langue par defaut et langues disponibles : `src/i18n/config.ts`.
- Textes de l'interface : `src/i18n/messages/fr.json` et `en.json`.
- Contenu (profil, projets, competences, parcours) : entierement gere depuis le backoffice, aucune modification de code necessaire.

## Avis visiteurs

Un visiteur peut laisser un avis (nom, message, note 1 a 5 etoiles). Par defaut, un avis
soumis n'est **pas visible immediatement** : il apparait dans `/admin/reviews` en attente
de validation, pour eviter le spam. Une fois publie, il apparait sur le site avec la
moyenne des notes et la date. Ce comportement peut etre ajuste dans
`src/app/api/reviews/route.ts` si vous preferez une publication immediate.
