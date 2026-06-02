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
| `project.html` | 案件詳細ページ。`project.html?id=p001` の形式で `data.js` から1件を表示（所在地・詳細・写真・ストーリー・資料ダウンロード） |
| `styles.css` | 公開ページ・詳細ページの共通スタイル |
| `images/` | プロジェクト写真の格納庫。admin から端末/iPad の写真を直接アップロード可（`images/README.md`） |
| `downloads/` | ダウンロード資料（PDF等）の格納庫。`downloads/README.md` に追加手順 |
| `CLAUDE.md`  | 本ドキュメント（ルールとデータ構造） |

`index.html`・`admin.html`・`project.html` はいずれも `data.js` を読み込みます。
公開ページのカードは `project.html?id=<id>` へリンクします。
データを変更する正規の手順は **admin.html で編集 → `data.js` を書き出して差し替え** です。
`data.js` を手で直接編集する場合も、必ず下記の構造を守ってください。

## データ構造（`data.js`）

`data.js` はグローバル定数 `SITE_DATA` を1つだけ定義します。形は固定です。

```js
const SITE_DATA = {
  categories: [
    { id: "ongoing",   ja: "進行中", en: "In progress" },  // 案件は進行状況で分類
    { id: "completed", ja: "完了",   en: "Completed" },
    // ...
  ],
  projects: [
    {
      id: "p001",                       // 一意なID（文字列）。"p" + 連番を推奨
      category: "ongoing",              // categories[].id のいずれか
      image: "https://.../photo.jpg",   // 実写真のURLまたは相対パス（images/foo.jpg）
      name:     { ja: "案件名",     en: "Project name" },
      location: { ja: "所在地",     en: "Location" },
      summary:  { ja: "概要",       en: "Summary" },
      status:   { ja: "ステータス", en: "Status" },   // 例: 開発中 / Under development
      year:     2024,                   // 数値（着工/竣工年など）。任意。未設定は null
      area:     "108室 / 108 rooms",    // 文字列（客室・規模）。任意。未設定は ""
      investment: { ja: "投資ハイライト", en: "Investment highlight" },
      landArea: "約32,000坪（約105,800㎡）", // 文字列（土地規模）。任意。未設定は ""
      plan:  { ja: "計画概要",         en: "Plan overview" },        // 詳細ページ用
      story: { ja: "プロジェクトストーリー", en: "Project story" },  // 詳細ページ用
      gallery: [                        // 写真（複数）。URL または images/foo.jpg。空配列可
        "https://.../1.jpg",
        "images/p001-2.jpg"
      ],
      documents: [                      // ダウンロード資料。空配列可
        { ja: "事業計画書", en: "Business plan", file: "downloads/p001-plan.pdf" }
      ]
    }
    // ...
  ]
};
```

### フィールドのルール

- **バイリンガル項目**（`name` / `location` / `summary` / `status` / `investment` /
  `plan` / `story`）は必ず `{ ja, en }` の両方を持たせます。片方が空でも**キー自体は
  省略しない**こと。
- `category` は `categories` に存在する `id` を必ず指すこと（不整合は禁止）。
- `id` は全 `projects` 内で一意にすること。
- `image` は一覧カードと詳細ページのメイン写真です。空文字 `""` の場合は
  `gallery[0]` を使い、それも無ければプレースホルダーを表示します。
- `year` は数値または `null`。`area` / `landArea` は文字列（空可）。
- `gallery` は**文字列の配列**（写真のURLまたは相対パス）。空配列 `[]` 可。
  先頭要素は一覧カードのサムネイルにも使われます（`image` 未設定時）。
  admin では **端末/iPad の写真をアップロード**（GitHub Contents API で `images/` に
  直接コミット）、**Dropbox 共有リンク**（自動で直接表示URLに変換）、URL/相対パスの
  3通りで登録できます。アップロードは「GitHub に保存」のリポジトリ/ブランチ/トークンを使用します。
- `documents` は **`{ ja, en, file }` の配列**。`file` はリポジトリ内の相対パス
  （`downloads/xxx.pdf`）またはフルURL。`ja`/`en` はダウンロードボタンの表示名。
  空配列 `[]` 可。資料の追加手順は `downloads/README.md` を参照。
- 上記の追加フィールド（`landArea` / `plan` / `story` / `gallery` / `documents`）は
  **省略せず常に出力**します（admin の書き出しは未入力でも空値で必ず含めます）。

## 管理画面からの保存方法（`admin.html`）

データの更新は2通りで反映できます。

1. **GitHub に直接保存（推奨・既定）**
   - 「GitHub に保存」パネルで リポジトリ（`owner/repo`）・ブランチ・パス（`data.js`）・
     コミットメッセージ・**アクセストークン（PAT）** を入力し「GitHub に保存」。
   - GitHub Contents API（`GET`→`PUT /repos/{owner}/{repo}/contents/{path}`）で
     `data.js` を直接コミットします。保存直前に最新 SHA を取得して上書きします。
   - **PAT はリポジトリに保存しません。** 既定はメモリ/`sessionStorage`（タブを閉じると消去）。
     「この端末に保存」を選んだ場合のみ `localStorage` に保存します（共有PCでは非推奨）。
   - 推奨トークン: 当該リポジトリに限定した **fine-grained PAT（Contents: Read and write）**。
2. **手動で書き出し（フォールバック）**
   - 「data.js を書き出す」でコピー/ダウンロードし、リポジトリの `data.js` を差し替えてコミット。

> いずれの場合も、`admin.html` が生成する `data.js` は
> `index.html` / `project.html` がそのまま読める形式を厳守します。

## 多言語表示（i18n）の方針

- 現在の言語は JavaScript の変数 `currentLang`（`"ja"` または `"en"`）で管理します。
- 画面右上のトグルボタンで切り替え、`localStorage`（キー `dhp-lang`）に保存します。
- HTML 内の固定文言は `data-i18n="キー"` 属性を付け、辞書 `UI_TEXT` から流し込みます。
- 案件データの文言は `project.name[currentLang]` のように `currentLang` で参照します。
- 言語を切り替えたら、固定文言・案件カード・カテゴリーフィルターを**すべて再描画**します。
- `<html lang>` 属性も切替時に更新します。

## 開発ルール

1. 新しいバイリンガル文言を増やすときは `UI_TEXT` に `ja` / `en` の両方を追加すること。
2. データ構造を変更する場合は **4つすべて**（`data.js` のスキーマ、`index.html` の描画、
   `project.html` の詳細描画、`admin.html` のフォームと書き出し）を同時に更新し、
   本 CLAUDE.md も改訂すること。
3. `admin.html` が書き出す `data.js` は、`index.html` / `project.html` がそのまま
   読める形式を厳守すること（書き出し → 再読込で内容が一致すること）。
4. 外部ライブラリ・ビルド手順は導入しない（素の HTML/CSS/JS を維持）。
5. 変更後は必ず **(a) 日本語表示 (b) 英語表示 (c) カテゴリーフィルター
   (d) 詳細ページ（写真・ストーリー・資料ダウンロード）
   (e) admin での追加 → data.js 書き出しが index.html / project.html で読める**
   ことを確認すること。
