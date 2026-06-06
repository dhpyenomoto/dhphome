-- =====================================================================
-- dhp都市開発 — Supabase スキーマ（projects テーブル + RLS）
-- Supabase ダッシュボード → SQL Editor に貼り付けて実行してください。
-- =====================================================================

create table if not exists public.projects (
  id          text primary key,                       -- 例: dhp0001
  sort_order  integer not null default 0,             -- 表示順（小さいほど先頭）
  category    text    not null default 'ongoing',     -- ongoing / completed
  data        jsonb   not null,                        -- 案件オブジェクト一式（name/location/.../gallery/documents）
  updated_at  timestamptz not null default now()
);

create index if not exists projects_sort_idx on public.projects (sort_order);

-- Row Level Security を有効化
alter table public.projects enable row level security;

-- 公開（匿名）ユーザーは「読み取りのみ」許可
drop policy if exists "projects public read" on public.projects;
create policy "projects public read"
  on public.projects for select
  to anon, authenticated
  using (true);

-- ログイン済みユーザーは「追加・更新・削除」を許可
drop policy if exists "projects auth insert" on public.projects;
create policy "projects auth insert"
  on public.projects for insert
  to authenticated
  with check (true);

drop policy if exists "projects auth update" on public.projects;
create policy "projects auth update"
  on public.projects for update
  to authenticated
  using (true) with check (true);

drop policy if exists "projects auth delete" on public.projects;
create policy "projects auth delete"
  on public.projects for delete
  to authenticated
  using (true);
