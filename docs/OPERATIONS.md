# 運用メモ — なぞまちワールド

公開を維持するための正本。担当が変わってもこの通りやればデプロイできる。
最終更新： 2026-11-10

## 公開先（絶対に取り違えないこと）

- 公開URL： https://nazomachi-world-a3598.web.app
- Firebaseプロジェクト： `nazomachi-world-a3598`（表示名 Nazomachi World、プロジェクト番号 78150118236、Spark無料プラン、Google Analytics無効、課金なし）
- **所属アカウントは個人（3twowings28113@gmail.com）**。DevFestの応募が個人メールのため。Craft Stadiumのアカウント等、組織のアカウントでリソースを作らない（過去に誤って作成した `nazomachi-world-2026`〈Craft側〉は残置してあり、削除は代表の明示OKがあるまでしない）。
- 大会ルール： 公開URLは Regional Day（2026-11-14）まで生かし続けること。

## デプロイ手順

- ソースの正本： このリポジトリのルート（index.html / app.js / style.css / i18n-data.js / assets/）。作業コピーは開発環境の `~/workspace/devfest/app-final/`。
- Firebase CLI はログイン済み設定で実行する。デプロイ時は設定フォルダを一時ディレクトリにコピーしてから実行する（ワークスペース直下だと権限エラーで失敗するため）。デプロイ後に設定は元の場所へ戻す。
- **キャッシュ対策（必須）**： index.html の style.css / app.js / i18n-data.js の参照には版番号クエリ（?v=N）が付いている。CSS/JSを変えたら必ず版番号を上げること。上げ忘れると利用者の端末で「新しいHTML＋古いCSS」の表示崩れが起きる（2026-11-10に実際に発生した）。

## リポジトリ構成

- ルート： アプリ本体（index.html / app.js / style.css / i18n-data.js / assets / firebase.json / .firebaserc）
- docs/product-document.md： プロダクト資料（提出用）
- docs/DESIGN_DECISIONS.md： 設計判断の記録（なぜそうしたか）
- docs/ASSETS.md： 素材インベントリ（出所・ライセンス）
- docs/design.md： デザインシステム（駅名標デザインの規則）
- README.md： プロジェクト概要

## 変更時のルール

- 変更は必ず「ローカル検証（日英両方で生成→捜査→推理→結果まで）→デプロイ→push」の順。push のコミットメッセージには版（v7等）と変更点を書く。
- 翻訳を変えるときは i18n-data.js の ja/en 両方を直す。生成事件は言語切替で再生成されるため、キット側の翻訳漏れは英語モードの生成で露呈する。
- マスコット等の画像を差し替える場合は ASSETS.md に追記する。
