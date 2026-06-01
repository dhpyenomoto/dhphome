# CLAUDE.md — dhp都市開発 バイリンガルサイト

このリポジトリは **dhp都市開発（dhp Urban Development）** の投資家・ディベロッパー向け
**日本語 / 英語 バイリンガル** ウェブサイトです。ビルドツールやサーバーを必要としない
**静的サイト（プレーンな HTML / CSS / JavaScript）** として構成しています。
ファイルをブラウザで直接開くだけで動作します。

## ファイル構成

| ファイル | 役割 |
|----------|------|
| `index.html` | 公開ページ。案件（プロジェクト）カードの一覧表示、言語切替（JA/EN）、カテゴリーフィルター |
| `data.js`    | 案件データとカテゴリー定義の**唯一の情報源（single source of truth）** |
| `admin.html` | 案件の追加・編集・削除を行い、`data.js` を再生成して書き出す管理画面 |
| `styles.css` | 公開ページの共通スタイル |
| `CLAUDE.md`  | 本ドキュメント（ルールとデータ構造） |

`index.html` と `admin.html` は両方とも `data.js` を読み込みます。
データを変更する正規の手順は **admin.html で編集 → `data.js` を書き出して差し替え** です。
`data.js` を手で直接編集する場合も、必ず下記の構造を守ってください。

## データ構造（`data.js`）

`data.js` はグローバル定数 `SITE_DATA` を1つだけ定義します。形は固定です。

```js
const SITE_DATA = {
  categories: [
    { id: "residential", ja: "住宅",   en: "Residential" },
    // ...
  ],
  projects: [
    {
      id: "p001",                       // 一意なID（文字列）。"p" + 連番を推奨
      category: "residential",          // categories[].id のいずれか
      image: "https://.../photo.jpg",   // 実写真のURLまたは相対パス（images/foo.jpg）
      name:     { ja: "案件名",     en: "Project name" },
      location: { ja: "所在地",     en: "Location" },
      summary:  { ja: "概要",       en: "Summary" },
      status:   { ja: "ステータス", en: "Status" },   // 例: 開発中 / Under development
      year:     2024,                   // 数値（着工/竣工年など）。任意。未設定は null
      area:     "12,000 m²",            // 文字列。任意。未設定は ""
      investment: { ja: "投資ハイライト", en: "Investment highlight" }
    }
    // ...
  ]
};
```

### フィールドのルール

- **バイリンガル項目**（`name` / `location` / `summary` / `status` / `investment`）は
  必ず `{ ja, en }` の両方を持たせます。片方が空でも**キー自体は省略しない**こと。
- `category` は `categories` に存在する `id` を必ず指すこと（不整合は禁止）。
- `id` は全 `projects` 内で一意にすること。
- `image` は **実写真**を差し込むためのフィールドです。フルURL（`https://...`）でも
  リポジトリ内の相対パス（`images/xxx.jpg`）でも可。空文字 `""` の場合、
  公開ページ側でプレースホルダー画像を表示します。
- `year` は数値または `null`。`area` は文字列（空可）。

## 多言語表示（i18n）の方針

- 現在の言語は JavaScript の変数 `currentLang`（`"ja"` または `"en"`）で管理します。
- 画面右上のトグルボタンで切り替え、`localStorage`（キー `dhp-lang`）に保存します。
- HTML 内の固定文言は `data-i18n="キー"` 属性を付け、辞書 `UI_TEXT` から流し込みます。
- 案件データの文言は `project.name[currentLang]` のように `currentLang` で参照します。
- 言語を切り替えたら、固定文言・案件カード・カテゴリーフィルターを**すべて再描画**します。
- `<html lang>` 属性も切替時に更新します。

## 開発ルール

1. 新しいバイリンガル文言を増やすときは `UI_TEXT` に `ja` / `en` の両方を追加すること。
2. データ構造を変更する場合は **3つすべて**（`data.js` のスキーマ、`index.html` の描画、
   `admin.html` のフォームと書き出し）を同時に更新し、本 CLAUDE.md も改訂すること。
3. `admin.html` が書き出す `data.js` は、`index.html` がそのまま読める形式を厳守すること。
4. 外部ライブラリ・ビルド手順は導入しない（素の HTML/CSS/JS を維持）。
5. 変更後は必ず **(a) 日本語表示 (b) 英語表示 (c) カテゴリーフィルター
   (d) admin での追加 → data.js 書き出しが index.html で読める** ことを確認すること。
