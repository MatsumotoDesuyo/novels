# ノベルゲーム シナリオアーカイブ作成ツール

このツールは、ノベルゲームのシナリオファイルを協力者と共有するために、指定したディレクトリを一つのファイルにまとめる処理を提供します。

## 📁 含まれるファイル

- `create-scenario-zip.js` - インタラクティブ版（ディレクトリを選択可能）
- `simple-archive.js` - 簡易版（設定を編集して使用）
- `create-archive.bat` - Windows用実行バッチファイル

## 🚀 使用方法

### 方法1: バッチファイルを使用（推奨）

1. `create-archive.bat` をダブルクリック
2. インタラクティブ版(1) または 簡易版(2) を選択
3. 指示に従って操作

### 方法2: Node.jsで直接実行

#### インタラクティブ版
```bash
node create-scenario-zip.js
```

- 利用可能なディレクトリが表示されます
- 数字をカンマ区切りで入力（例: 1,2,3）
- `all` で全て選択
- `exit` で終了

#### 簡易版
```bash
node simple-archive.js
```

- `simple-archive.js` の `selectedDirectories` 配列を編集
- 含めたいディレクトリ名を追加
- ファイルを保存してから実行

## 📂 利用可能なディレクトリ

- `scenarios` - シナリオファイル
- `characters` - キャラクター設定
- `plots` - プロット
- `settings` - 設定ファイル
- `organizations` - 組織情報
- `cities` - 都市情報
- `cases` - 事件情報
- `events` - イベント情報
- `tips` - ヒント情報

## 📦 出力形式

### インタラクティブ版
- `.tar` 形式のテキストファイル
- 各ファイルがヘッダー情報付きで含まれます

### 簡易版
- `.txt` 形式のテキストファイル
- 読みやすい形式でフォーマット済み

## 💡 使用例

### シナリオと設定だけを共有したい場合
簡易版の `selectedDirectories` を以下のように編集：

```javascript
const selectedDirectories = [
    'scenarios',
    'settings'
];
```

### 全てのファイルを共有したい場合
インタラクティブ版で `all` を入力

## 🔧 カスタマイズ

### 簡易版のカスタマイズ
`simple-archive.js` の以下の部分を編集：

```javascript
// 含めるディレクトリを指定
const selectedDirectories = [
    'scenarios',
    'characters',
    'plots'
    // 必要に応じて追加
];

// 出力ファイル名を指定
const outputFilename = `novel-game-${new Date().toISOString().slice(0, 10)}.txt`;
```

## 📋 注意事項

- Node.jsがインストールされている必要があります
- テキストファイルのみ対応（画像ファイルなどは含まれません）
- 大きなファイルが含まれる場合、出力ファイルも大きくなります
- package.jsonは不要です（Node.js標準ライブラリのみ使用）

## 🤝 協力者との共有

作成されたアーカイブファイルを協力者に送信することで、プロジェクトの構造を保ったままファイルを共有できます。
