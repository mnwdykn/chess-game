# 技術設計書 – チェスアプリ (開発コードネーム: "ChessMate")

## 1. 概要

**プロジェクト名**: ChessMate  
**目的**  
- 便利なチェスアプリを作りつつ、アプリ開発の一連のフローを学ぶ  
- Reactを中心とした最新Web技術の習得  

**概要**  
- ブラウザ上で実行できるチェスアプリ  
- Stockfish エンジンを用いたBot対戦や棋譜解析機能を提供  
- ローカルストレージで対局データを保存し、解析ビューで振り返り可能  

**対象プラットフォーム**: PCブラウザ（今後モバイル・クラウド拡張の可能性あり）

---

## 2. 技術スタック

| 分野             | 技術・ライブラリ                | 備考                                          |
|------------------|--------------------------------|-----------------------------------------------|
| フロントエンド   | React (JS)                     | Create React App / Vite などビルドツールはお好みで |
| チェスエンジン   | Stockfish (WebAssembly版)       | Bot対戦や棋譜解析に使用                       |
| チェスロジック   | chess.js / react-chessboard        | 駒の移動や合法手判定、UIレンダリング          |
| 状態管理         | React Hooks (useState / useReducer)  | Reduxは必要に応じて検討                      |
| データ保存       | LocalStorage                   | ローカル完結で学習がしやすい                  |
| バージョン管理   | Git + GitHub                   | featureブランチ運用（後述）                  |
| ドキュメント管理 | Markdown (README, 技術設計書など)| NotionやGitHub Wikiとも連携可能               |

---

## 3. ディレクトリ構成

```plaintext
ChessMate/
├── public/
│   ├── index.html
│   ├── chess-piece-sprite.png
├── src/
|   ├── index.js
│   ├── App.jsx
│   ├── components/
│   │   ├── jsx/
│   │   │   ├── ChessBoard.jsx
│   │   │   ├── GameController.jsx
│   │   │   ├── ModeSelector.jsx
│   │   │   ├── BotControlPanel.jsx
│   │   │   ├── SaveGameButton.jsx
│   │   │   ├── SavedGamesList.jsx
│   │   │   ├── AnalysisPanel.jsx
│   │   │   ├── EvalGraph.jsx
│   │   │   └── PGNDownloader.jsx
│   │   └── css/
│   │       ├── ChessBoard.css
│   │       ├── GameController.css
│   │       ├── ModeSelector.css
│   │       ├── BotControlPanel.css
│   │       ├── SaveGameButton.css
│   │       ├── SavedGamesList.css
│   │       ├── AnalysisPanel.css
│   │       ├── EvalGraph.css
│   │       └── PGNDownloader.css
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── GamePage.jsx
│   │   └── AnalysisPage.jsx
│   ├── hooks/
│   │   ├── useChess.js
│   │   └── useStockfish.js
│   ├── utils/
│   │   ├── localStorageManager.js
│   │   └── pgnUtils.js
│   ├── assets/
│   │   └── style/
│   │       └── global.css
├── package.json
├── README.md
└── .gitignore

```

---

## 4. コンポーネント設計

### 1. ChessBoard コンポーネント
- **ChessBoard.jsx**  
  - **役割**:  
    - チェス盤をレンダリングする主要なUIコンポーネント  
    - chessboard.jsxライブラリを利用して、盤面の描画と駒のドラッグ＆ドロップを実装  
    - 親コンポーネントやフック（例: useChess.js）から渡される現在の盤面情報を表示し、ユーザー操作に応じて更新を反映する  
- **ChessBoard.css**  
  - **役割**:  
    - ChessBoard.jsxに対応するスタイルシート  
    - 盤面のサイズ、グリッドレイアウト、駒のアニメーションなどのデザインを定義

---

### 2. GameController コンポーネント
- **GameController.jsx**  
  - **役割**:  
    - ゲームの進行を制御するロジックを担当  
    - useChess.js（chess.jsをラップしたカスタムフック）と連携し、手番管理、合法手チェック、チェックメイト判定などのゲームルールを実装  
    - ユーザーの操作後に状態を更新し、次の手番やゲーム終了の判断を行う  
- **GameController.css**  
  - **役割**:  
    - GameController.jsx用のスタイルを定義  
    - ボタン、ステータス表示、インジケーターなど、ゲーム進行に関するUI要素のデザインを整える

---

### 3. ModeSelector コンポーネント
- **ModeSelector.jsx**  
  - **役割**:  
    - Bot対戦とローカル対戦のモードを選択するUIを提供  
    - ユーザーが対戦モードを選ぶと、対応する画面や状態に遷移するためのイベントを発火する  
- **ModeSelector.css**  
  - **役割**:  
    - ModeSelector.jsxに対応するスタイルを管理  
    - ボタンや選択リスト、レイアウトの調整など、モード選択に関する視覚的なデザインを実現

---

### 4. BotControlPanel コンポーネント
- **BotControlPanel.jsx**  
  - **役割**:  
    - Bot（Stockfish）の設定（例えば、強さや探索深度）を調整するためのUIパネル  
    - ユーザーが設定値を変更することで、Botの応答ロジックに反映させる  
- **BotControlPanel.css**  
  - **役割**:  
    - BotControlPanel.jsxのスタイルを定義  
    - インターフェースのレイアウト、入力フィールド、スライダーなどの見た目を整える

---

### 5. SaveGameButton コンポーネント
- **SaveGameButton.jsx**  
  - **役割**:  
    - 対局終了時に、現在のゲーム状態や棋譜をLocalStorageに保存する機能を持つボタン  
    - localStorageManager.jsの関数を呼び出し、PGN形式やJSON形式でデータを記録する  
- **SaveGameButton.css**  
  - **役割**:  
    - SaveGameButton.jsxの見た目（ボタンの色、サイズ、ホバー効果など）を定義

---

### 6. SavedGamesList コンポーネント
- **SavedGamesList.jsx**  
  - **役割**:  
    - LocalStorageに保存された過去の対局データを一覧表示する  
    - 各保存ゲームの概要（日時、対局モード、勝敗など）をリスト形式で表示し、詳細表示や再解析への遷移をサポートする  
- **SavedGamesList.css**  
  - **役割**:  
    - 保存された棋譜一覧のレイアウト、フォント、間隔など、ユーザーが読みやすいデザインを提供

---

### 7. AnalysisPanel & EvalGraph コンポーネント
- **AnalysisPanel.jsx**  
  - **役割**:  
    - 対局終了後、Stockfishによる棋譜解析結果（評価値、悪手の検出など）をテキストやグラフィカルな要素として表示  
    - ゲームの各局面での評価や戦略的な指摘をユーザーに提供する  
- **AnalysisPanel.css**  
  - **役割**:  
    - AnalysisPanel.jsxのテキスト、色、レイアウトなどのスタイルを定義し、解析結果の視認性を向上させる
- **EvalGraph.jsx**  
  - **役割**:  
    - 対局中または対局後の評価値の変化をグラフ形式で表示する  
    - チャートライブラリを用いて、評価の推移や局面ごとの変動を可視化する  
- **EvalGraph.css**  
  - **役割**:  
    - EvalGraph.jsxにおけるグラフのデザイン、軸のスタイル、レスポンシブ対応などを管理

---

### 8. PGNDownloader コンポーネント
- **PGNDownloader.jsx**  
  - **役割**:  
    - 現在の対局の棋譜をPGN（Portable Game Notation）形式でエクスポートする機能を実装  
    - pgnUtils.jsと連携し、正しいフォーマットに変換後、ユーザーがファイルとしてダウンロードできるようにする  
- **PGNDownloader.css**  
  - **役割**:  
    - PGNDownloader.jsxのダウンロードボタンや関連UIのスタイルを定義し、直感的な操作ができるようにデザインする



---
## 5. その他のファイルの説明

### 5.1 Public ディレクトリ
- **index.html**  
  - **役割**:  
    - ReactアプリのエントリーポイントとなるHTMLファイル。  
    - `<div id="root"></div>` など、ReactがマウントされるDOM要素を定義。  
    - メタ情報、外部スクリプトやスタイルシートの読み込み設定を含む。
- **chess-piece-sprite.png**  
  - **役割**:  
    - チェス盤に表示する駒の画像をまとめたスプライトシート。  
    - コンポーネントで参照され、パフォーマンス向上に寄与する。

---

### 5.2 アプリケーションルートファイル
- **App.jsx**  
  - **役割**:  
    - アプリ全体のルートコンポーネント。  
    - グローバルな状態管理、ルーティングの設定（`<Router>`のラップ）など、全体レイアウトを定義する。
- **routes.js**  
  - **役割**:  
    - 各ページコンポーネント（HomePage, GamePage, AnalysisPage）のルート設定を行う。  
    - React Router等を利用して、URLとコンポーネントのマッピングを定義する。

---

### 5.3 Pages ディレクトリ
- **HomePage.jsx**  
  - **役割**:  
    - アプリの初期画面。  
    - 対戦モードの選択やプロジェクトの概要、利用方法などをユーザーに案内するUIを提供。
- **GamePage.jsx**  
  - **役割**:  
    - 実際の対局画面。  
    - ChessBoardやGameController、BotControlPanelなどのコンポーネントを統合し、対局中の状態を表示・操作可能にする。
- **AnalysisPage.jsx**  
  - **役割**:  
    - 対局終了後の解析画面。  
    - SavedGamesListやAnalysisPanel、EvalGraphを組み合わせ、過去の対局データや解析結果を表示する。

---

### 5.4 Hooks ディレクトリ
- **useChess.js**  
  - **役割**:  
    - chess.js をラップし、対局の状態（合法手、手番、盤面状態など）の管理と更新を行うカスタムフック。  
    - 各コンポーネントはこのフックを通じて最新の対局状態を取得・操作する。
- **useStockfish.js**  
  - **役割**:  
    - Stockfishエンジンとの通信を管理するカスタムフック。  
    - Web Workerを利用して、対局中の解析やBotの手番の決定を非同期で行う。

---

### 5.5 Utils ディレクトリ
- **localStorageManager.js**  
  - **役割**:  
    - LocalStorageを用いたデータの保存・取得のインターフェースを提供するユーティリティ。  
    - 対局データ（棋譜、メタ情報、解析結果）を統一フォーマットで管理する。
- **pgnUtils.js**  
  - **役割**:  
    - 棋譜データ（PGN形式）の変換、解析、フォーマット補正などを行う補助関数群。  
    - PGNファイルの生成や解析結果の整形に使用する。

---

### 5.6 Assets ディレクトリ
- **style/global.css**  
  - **役割**:  
    - アプリ全体に適用されるグローバルなCSSスタイル。  
    - フォント、カラー、リセットCSSなどの基本設定を含む。

---

### 5.7 その他のルートファイル
- **package.json**  
  - **役割**:  
    - プロジェクトの依存関係、スクリプト、プロジェクトメタ情報を管理する。  
    - npm（またはyarn）のパッケージ管理に利用する。
- **README.md**  
  - **役割**:  
    - プロジェクトの概要、セットアップ方法、使用方法、開発ルールなどを記述したドキュメント。  
    - GitHubリポジトリのトップページに表示される。
- **.gitignore**  
  - **役割**:  
    - Gitに追跡させないファイルやディレクトリ（例：node_modules、ビルド成果物など）を定義する。


---

## 6. ブランチ構成 & ファイル分担

### ブランチ戦略

- **main**: 安定稼働用（最終リリース版）  
- **dev**: 開発統合ブランチ  
- **feature/\***: 機能単位で作業ブランチを切る

### 担当

- **UI関連 (Yo)**  
- **ロジック関連 (gotou)**

| ブランチ名                     | 対応ファイル群                                                   | 機能概要                          | 担当     |
|--------------------------------|------------------------------------------------------------------|-----------------------------------|----------|
| `feature/chessboard-ui`        | `ChessBoard.jsx`, `ChessBoard.css`                               | チェス盤UI                         | Yo       |
| `feature/mode-selector`        | `ModeSelector.jsx`, `ModeSelector.css`                           | 対戦モード選択画面                | Yo       |
| `feature/bot-ui-controls`      | `BotControlPanel.jsx`, `BotControlPanel.css`                     | Botの強さ設定UI                    | Yo       |
| `feature/saved-games-list`     | `SavedGamesList.jsx`, `SavedGamesList.css`                       | 棋譜リスト表示                     | Yo       |
| `feature/analysis-ui`          | `AnalysisPanel.jsx`, `AnalysisPanel.css`, `EvalGraph.jsx`, `EvalGraph.css` | 解析UIとグラフ表示       | Yo       |
| `feature/pgn-export` (UI)      | `PGNDownloader.jsx`, `PGNDownloader.css`                         | 棋譜DLボタンUI                     | Yo       |
| `feature/game-logic`           | `GameController.jsx`, `GameController.css`, `useChess.js`        | 手番管理・勝敗判定                | gotou    |
| `feature/use-stockfish-hook`   | `useStockfish.js`                                                | Stockfish制御                     | gotou    |
| `feature/save-game`            | `SaveGameButton.jsx`, `SaveGameButton.css`, `localStorageManager.js` | 棋譜保存                         | gotou    |
| `feature/pgn-export` (logic)   | `pgnUtils.js`                                                    | PGNロジック部                     | gotou    |
| `feature/layout-routing`       | `App.jsx`                                          | ルーティング                       | gotou       |
| `feature/pages`                | `HomePage.jsx`, `GamePage.jsx`, `AnalysisPage.jsx`               | 画面の骨組                         | gotou       |
| `feature/global-style`         | `global.css`                                                     | 全体CSS設計（Optional）           | Yo       |
| `feature/ui-polish`            | 全ての `.css` の微調整                                            | UI仕上げ                           | Yo       |

---

## 7. データ管理

- **LocalStorage管理**  
  対局データはLocalStorageに以下の形式で保存する。  
  - PGN形式の棋譜データ  
  - JSON形式のメタ情報（対局日時、勝敗、使用モードなど）  
  - 解析結果（各手ごとの評価値、悪手の情報など）

- **保存方法**  
  `localStorageManager.js` で一括管理し、保存・読み込みのインターフェースを提供する。

---

## 8. 状態管理フロー

- **React Hooksの利用**  
  - `useChess.js`: chess.js を用いたゲーム状態（手番、合法手、盤面状態）の管理  
  - `useStockfish.js`: Stockfishエンジンとの通信、解析結果の取得を管理

- **UIとの連携**  
  - 各UIコンポーネント（例: ChessBoard.jsx, GameController.jsx）はこれらのカスタムフックを呼び出し、最新の状態を反映する  
  - 状態の変更は、ユーザー操作（駒移動、ボタン操作など）やStockfishの応答に応じて更新される

- **データフローの例**  
  1. 対局開始時、`useChess.js` が初期状態を生成  
  2. ユーザー操作により状態が更新され、盤面が再描画される  
  3. Botの手番時、`useStockfish.js` が解析リクエストを送り、結果を `useChess.js` 経由で反映  
  4. 対局終了時、状態データがLocalStorageに保存される

---

## 9. 開発スケジュール & マイルストーン（3ヶ月想定）

| 期間         | 主なタスク                                                         | 備考                         |
|--------------|--------------------------------------------------------------------|------------------------------|
| 1〜2週目     | - 技術選定・リポジトリ作成<br>- `feature/chessboard-ui` & `feature/layout-routing` | UIの土台とルーティング       |
| 3〜5週目     | - `feature/game-logic`<br>- `feature/use-stockfish-hook`<br>- `feature/mode-selector` | 手番管理 & Bot対戦           |
| 6〜8週目     | - `feature/save-game`<br>- `feature/saved-games-list`<br>- `feature/analysis-ui` | 棋譜保存 & 解析表示          |
| 9〜10週目    | - `feature/pgn-export`<br>- `feature/ui-polish`                     | 全体仕上げ                   |
| 11〜12週目   | - ドキュメント整備<br>- バグ修正<br>- リリース準備                    | README更新 & 動作テスト       |

---

## 10. Git運用ルール

- **ブランチ戦略**: `main` / `dev` / `feature/*`  
- **コミット規約**:  
  - `feat: ...` (新機能)  
  - `fix: ...` (バグ修正)  
  - `docs: ...` (ドキュメント修正) など  
- **プルリクレビュー**: 基本、担当外の人がレビュー後に `dev` にマージ  
- **コンフリクト回避**: 担当領域のファイルは重ならないように事前調整

---

## 11. 今後の拡張（v2以降）

- **オンライン対戦**: サーバー連携、ユーザー認証  
- **クラウド保存**: FirebaseやSupabaseへの移行  
- **モバイル対応**: レスポンシブ or PWA  
- **自作エンジン開発**: Stockfish以外に独自Botを追加  
- **SNSシェア機能**: 棋譜や結果の共有

- **個人練習**:ロジック等関係なしに自由に駒を置けて自由に動かせるページ
- **自動棋譜読み込み機能**:chess.comからPNGファイルを自動的に読み込む機能

---

### 付録：最初のタスク例

1. リポジトリ作成 → `main` / `dev` ブランチ設定  
2. `feature/layout-routing` で `App.jsx` / `routes.js` の骨組みを作成 (Yo)  
3. `feature/chessboard-ui` で `ChessBoard.jsx` を表示 (Yo)  
4. `feature/game-logic` で `GameController.jsx` + `useChess.js` (gotou)  
5. その他、各機能の実装と統合

---


