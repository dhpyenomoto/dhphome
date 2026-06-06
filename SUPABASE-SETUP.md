# Supabase で CMS化する手順（データベース運用）

このサイトは、Supabase（無料枠あり）を使うと **管理画面からログインして編集 → 保存した瞬間に公開ページへ反映**（Git・トークン・再デプロイ不要）できます。外部ライブラリは使わず、ブラウザの `fetch` だけで接続します。

未設定の間は従来どおり `data.js` で動作します（フォールバック）。

## 1. Supabase プロジェクトを作る
1. https://supabase.com にサインイン（GitHub/Google/メール可）
2. 「New project」→ 名前・パスワード・リージョン（Tokyo 推奨）を設定して作成
3. 作成後、左メニュー **Project Settings → API** を開き、次の2つを控える
   - **Project URL**（例 `https://abcdxyz.supabase.co`）
   - **anon public** キー（`eyJ...` の長い文字列）

## 2. テーブルを作る
1. 左メニュー **SQL Editor → New query**
2. リポジトリの **`supabase-schema.sql`** の中身を貼り付けて **Run**
   - `projects` テーブルと、公開読み取り／ログイン書き込みの権限（RLS）が作られます

## 3. 管理者ユーザーを作る（ログイン用）
1. 左メニュー **Authentication → Users → Add user**
2. メールアドレスとパスワードを設定（このメール/パスワードで管理画面にログインします）
   - ※ 不特定多数の登録を防ぐため、**Authentication → Providers → Email** で
     「Confirm email」を有効、または「Allow new users to sign up」をオフにしておくと安全です

## 4. サイトに接続情報を設定
1. リポジトリの **`supabase-config.js`** を開く
2. 手順1で控えた値を入れる：
   ```js
   window.SUPABASE_CONFIG = {
     url: "https://abcdxyz.supabase.co",
     anonKey: "eyJhbGciOi...（anon public キー）"
   };
   ```
3. コミット（admin から保存 or 直接編集）→ デプロイ

> anon キーは公開して問題ないキーです。書き込みは RLS とログインで守られます。

## 5. 既存52件をデータベースへ取り込む（初回だけ）
1. 公開後の **管理画面（/admin）** を開く
2. 上部の Supabase パネルで **メール/パスワードでログイン**
3. 「**現在の data.js の内容を DB に取り込む（初期投入）**」ボタンを押す
   - これで `data.js` の案件がすべて DB に入り、以後は DB が正となります

## 6. 以後の運用
- 管理画面でログイン → 追加/編集/削除すると **即 DB に保存**され、公開ページを再読み込みすれば反映されます。
- Git もトークンも不要です（`data.js` は使われなくなりますが、バックアップとして残してOK）。

## トラブル時
- 公開ページが空 → `supabase-config.js` の値、テーブル作成、RLS の公開読み取りを確認。
- ログインできない → ユーザー作成済みか、メール/パスワード、Email プロバイダ有効かを確認。
- 保存できない → ログイン状態か、RLS の書き込みポリシーが作成されているか確認。
