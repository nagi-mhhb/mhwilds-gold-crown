# モンハンワイルズ 金冠チェックリスト PWA

GitHub Pages にそのままアップロードして公開できる構成です。

## 公開手順

1. GitHub で新しいリポジトリを作成
2. このフォルダの中身を **そのままリポジトリ直下**へアップロード
3. GitHub の **Settings → Pages** を開く
4. Source を **Deploy from a branch** にする
5. Branch を **main / root** にして保存
6. 数分待つと公開URLが発行されます
7. そのURLをXに貼れば、ブラウザから直接チェックリストを使えます

## スマホでPWAとして使う

公開URLをAndroid Chromeで開き、ブラウザのメニューから「ホーム画面に追加」または「アプリをインストール」を選択してください。

## データについて

チェック状態はブラウザの `localStorage` に保存されます。端末・ブラウザをまたいで自動同期する仕組みではありません。

## ファイル構成

- `index.html` — 本体
- `manifest.webmanifest` — PWA設定
- `sw.js` — オフラインキャッシュ
- `icons/icon-192.png` — アプリアイコン
- `icons/icon-512.png` — アプリアイコン
- `.nojekyll` — GitHub Pages用


### v6 修正
- リセットで全チェックを解除
- 旧バージョンの保存データもリセット時に削除
- チェックのON/OFF後に達成メーターと%を確実に更新
- Service Workerのキャッシュバージョンを更新
