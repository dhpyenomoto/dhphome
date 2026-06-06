/*
 * supabase-config.js — Supabase 接続設定
 *
 * url     … Supabase の Project URL
 * anonKey … anon public キー（公開してよいキー。書き込みは RLS とログインで保護）
 *
 * 値の取得元: Supabase ダッシュボード → Project Settings → API
 * 未設定（空）の場合は、サイトは data.js を使って従来どおり動作します。
 */
window.SUPABASE_CONFIG = {
  url: "https://ppqdkdzdeglrtawcikgr.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwcWRrZHpkZWdscnRhd2Npa2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MTg2MzcsImV4cCI6MjA5NjI5NDYzN30.JLetdBZYdGnJk3qGJsWVvGyJlU5mcpxMCC7gdMyFbV4"
};
