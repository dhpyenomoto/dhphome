/*
 * supabase-config.js — Supabase 接続設定
 *
 * 下の url と anonKey を、ご自身の Supabase プロジェクトの値に置き換えてください。
 *   Supabase ダッシュボード → Project Settings → API
 *     - url     … "Project URL"（例: https://abcdxyz.supabase.co）
 *     - anonKey … "Project API keys" の anon public キー
 *
 * anon キーは「公開してよい」キーです（ブラウザに埋め込む前提）。
 * 書き込みは Row Level Security とログイン認証で保護します（SUPABASE-SETUP.md 参照）。
 *
 * 未設定（空のまま）の場合は、サイトは data.js を使って従来どおり動作します。
 */
window.SUPABASE_CONFIG = {
  url: "",
  anonKey: ""
};
