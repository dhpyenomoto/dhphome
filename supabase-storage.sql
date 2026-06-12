-- =====================================================================
-- dhp都市開発 — Supabase Storage（画像保存）セットアップ
-- 管理画面からの写真アップロード（カバー写真・ギャラリー）に使います。
-- Supabase ダッシュボード → SQL Editor に貼り付けて Run してください。
-- =====================================================================

-- 公開バケット "images" を作成（既にあれば公開に更新）
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

-- 誰でも読み取り可（公開バケット）
drop policy if exists "images public read" on storage.objects;
create policy "images public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'images');

-- ログイン済みユーザーはアップロード・更新可
drop policy if exists "images auth insert" on storage.objects;
create policy "images auth insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'images');

drop policy if exists "images auth update" on storage.objects;
create policy "images auth update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'images')
  with check (bucket_id = 'images');
