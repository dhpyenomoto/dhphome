# downloads — 資料の格納庫 / Document storage

このフォルダは、各プロジェクト詳細ページからダウンロードできる**資料（PDF・画像・スライド等）**を置く場所です。
This folder stores downloadable materials (PDF / images / slides) shown on each project's detail page.

## 資料を追加する手順 / How to add a document

1. **ファイルをここに置く**
   - このフォルダ（`downloads/`）に PDF などを追加してコミットします。
   - GitHub の Web 画面からドラッグ＆ドロップでアップロードしてもOKです。
   - ファイル名は半角英数・ハイフン推奨（例: `p044-miyakojima-overview.pdf`）。
   - 外部に置く場合（Google Drive / Dropbox など）はファイルを置かず、共有URLを使います。

2. **プロジェクトに紐付ける（admin.html）**
   - `admin.html` を開き、対象プロジェクトの「編集」を押します。
   - 「資料（ダウンロード）」セクションで **表示名（日本語 / 英語）** と
     **ファイルの場所** を入力して「＋ 追加」。
   - ファイルの場所は次のどちらでも可：
     - リポジトリ内の相対パス … `downloads/p044-overview.pdf`
     - フルURL … `https://drive.google.com/...`
   - 「data.js を生成」→ ダウンロード/コピーして、リポジトリの `data.js` を差し替えてコミット。

3. **確認**
   - 公開ページの該当プロジェクト詳細（`project.html?id=p044`）に
     ダウンロードボタンが表示されます。

## メモ / Notes
- 静的サイトのため、サーバーへの自動アップロード機能はありません。
  「アップロード」＝このフォルダにファイルを置いてコミット、または外部URLを登録、です。
- `sample-project-overview.pdf` は動作確認用のサンプルです。差し替え・削除して構いません。
