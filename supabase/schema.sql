-- Execute este script no SQL Editor do Supabase.
-- ATENÇÃO: RLS fica desabilitado conforme solicitado.
-- Isso NÃO isola os favoritos: qualquer usuário autenticado pode manipular
-- registros de outros usuários se alterar as requisições diretamente.

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  google_books_id text not null,
  title text not null,
  authors text[] not null default '{}',
  thumbnail text,
  published_date text,
  created_at timestamptz not null default now(),
  constraint favorites_user_book_unique unique (user_id, google_books_id)
);

alter table public.favorites disable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.favorites to authenticated;