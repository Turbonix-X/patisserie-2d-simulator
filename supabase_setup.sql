-- ============================================================
-- Pâtisserie 2D Simulator : base de données des comptes (Supabase)
-- À coller UNE FOIS dans Supabase > SQL Editor > New query > Run.
-- Avant de lancer : ADMIN_EMAIL est déjà remplacé par ton adresse (tout en bas).
-- ============================================================

-- ---------- Les tables ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  pseudo      text not null default '',
  email       text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.instances (
  id          uuid primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  bakery_name text not null default '',
  save_data   text not null,
  updated_at  timestamptz not null default now()
);
create index if not exists instances_user_idx on public.instances(user_id);

-- Les administrateurs (leur adresse est vérifiée côté serveur, dans le jeton Supabase)
create table if not exists public.admins (
  email text primary key
);

alter table public.profiles  enable row level security;
alter table public.instances enable row level security;
alter table public.admins    enable row level security;   -- aucune politique : personne ne peut la lire depuis le jeu

-- ---------- Qui est administrateur ? ----------
-- Il faut que l'adresse du jeton soit dans la table admins ET que le compte ait confirmé son adresse :
-- impossible de se faire passer pour l'administrateur en s'inscrivant avec son adresse.
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.admins a
    join auth.users u on lower(u.email) = lower(a.email)
    where u.id = auth.uid()
      and u.email_confirmed_at is not null
      and lower(coalesce(auth.jwt() ->> 'email', '')) = lower(a.email)
  );
$$;
grant execute on function public.is_admin() to authenticated;

-- ---------- Un profil à chaque inscription ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, pseudo, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'pseudo', new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- 10 instances au maximum par joueur ----------
create or replace function public.enforce_max_instances()
returns trigger
language plpgsql
as $$
begin
  -- L'administrateur n'a pas de limite
  if not public.is_admin()
     and (select count(*) from public.instances where user_id = new.user_id and id <> new.id) >= 10 then
    raise exception 'max_instances: 10 pâtisseries au maximum par compte';
  end if;
  return new;
end;
$$;
drop trigger if exists instances_max_five on public.instances;
create trigger instances_max_five before insert on public.instances
  for each row execute function public.enforce_max_instances();

-- ---------- Les règles d'accès (RLS) ----------
-- Profils : chacun voit et modifie le sien. L'administrateur voit tout et peut supprimer.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists profiles_delete on public.profiles;
create policy profiles_delete on public.profiles for delete to authenticated
  using (public.is_admin());

-- Instances : chacun ne touche qu'aux siennes. L'administrateur peut tout voir et supprimer.
drop policy if exists instances_select on public.instances;
create policy instances_select on public.instances for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists instances_insert on public.instances;
create policy instances_insert on public.instances for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists instances_update on public.instances;
create policy instances_update on public.instances for update to authenticated
  using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
drop policy if exists instances_delete on public.instances;
create policy instances_delete on public.instances for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- ---------- Qui a le jeu ouvert, qui joue, qui est parti (vu par l'administrateur) ----------
create table if not exists public.presence (
  user_id     uuid primary key references public.profiles(id) on delete cascade,
  status      text not null default 'closed',      -- 'open' (menu), 'playing' ou 'closed'
  bakery_name text not null default '',
  level       integer not null default 0,
  platform    text not null default 'web',         -- 'web' ou 'app'
  last_seen   timestamptz not null default now()
);
alter table public.presence enable row level security;
drop policy if exists presence_select on public.presence;
create policy presence_select on public.presence for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists presence_insert on public.presence;
create policy presence_insert on public.presence for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists presence_update on public.presence;
create policy presence_update on public.presence for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- Supprimer un compte entier (administrateur seulement) ----------
create or replace function public.admin_delete_user(target uuid)
returns void
language plpgsql security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;
  delete from auth.users where id = target;   -- supprime aussi son profil et ses instances
end;
$$;
grant execute on function public.admin_delete_user(uuid) to authenticated;

-- ---------- À FAIRE : ton adresse d'administrateur ----------
insert into public.admins (email) values ('abi.2014.perso@gmail.com') on conflict do nothing;

-- ---------- Notes de version privees : seul l'administrateur les lit (elles ne sont pas dans les nouveautés publiques) ----------
create table if not exists public.admin_notes (
  id      serial primary key,
  version text not null unique,
  body_fr text not null default '',
  body_en text not null default ''
);
alter table public.admin_notes enable row level security;
drop policy if exists admin_notes_select on public.admin_notes;
create policy admin_notes_select on public.admin_notes for select to authenticated using (public.is_admin());

-- Dit a Supabase de relire la structure (sinon la nouvelle table peut ne pas etre vue tout de suite)
notify pgrst, 'reload schema';
