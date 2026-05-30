# GrowthFlow.ai

Production-ready Next.js social content planner with:

- Supabase email/password authentication
- Cookie-backed sessions for protected dashboard routes
- Gemini-powered post generation through a server route
- Database-backed content scheduling for real accounts
- Preserved demo mode with local seeded data and mock generation

## Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres
- Gemini API

## Environment

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

## Supabase Setup

1. Create a Supabase project.
2. Enable email/password auth.
3. Set your site URL and redirect URL to include:
   - `http://localhost:3000/auth/confirm`
   - your production `/auth/confirm` URL
4. Run the SQL in `supabase/migrations/20260530000000_init.sql`.
5. If users already signed up before the schema existed, rerun that SQL once. It now backfills `public.profiles` from `auth.users`.

## Run

```bash
npm install
npm run dev
```

## Production Notes

- Demo mode is intentionally separate from real accounts and uses local browser storage.
- Live AI generation is only available to authenticated users.
- Posts for authenticated users are stored in Supabase and protected with row-level security.
- The default live model is `gemini-2.5-flash`, which Google documents as a stable production model with structured outputs support.
- If you see `PGRST205` for `public.profiles` or `public.posts`, your hosted Supabase project has not had the migration applied yet.
