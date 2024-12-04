# Ordered List to Table Plugin

Obsidian のプラグインで、順序付きリストをテーブルに変換します。

---

## 特徴

- 順序付きリスト (`<ol>`) をテーブル (`<table>`) に変換します。
- リストから不要なアイコンやボタンを削除します。

---

## インストール

リポジトリをクローンし、依存関係をインストールしてプラグインを使用または開発するための手順です。

### 1. リポジトリをクローン

```bash
git clone https://github.com/sattyorin/ordered-list-to-table.git
cd ordered-list-to-table
```

### 2. 依存関係をインストール

`npm` を使用して必要な依存関係をインストールします。

```bash
npm install
```

### 3. プラグインをビルド

以下のコマンドでプラグインをビルドします。

```bash
npm run build
```

これにより、Obsidian が必要とする `main.js` ファイルがプロジェクトのルートディレクトリに生成されます。

### 4. Obsidian でプラグインを有効化

1. Obsidian のボルト（Vault）を開きます。
1. `ordered-list-to-table` フォルダを `.obsidian/plugins/` ディレクトリに移動、もしくはシンボリックリンクを作成します。
1. Obsidian 内で、**設定 > コミュニティプラグイン** に移動します。
1. インストール済みプラグインのリストから **Ordered List to Table Plugin** を有効化します。

---

## 開発

プラグインの開発を開始するためのコマンドです。

### 開発モードを開始

```bash
npm run dev
```

これにより、ソースファイルの変更を監視し、自動的にプラグインを再ビルドします。

### TypeScript のチェックを実行

TypeScript の型チェックを行うには、以下のコマンドを使用します。

```bash
npm run build
```
