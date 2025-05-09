// src/pages/GamePage.jsx
import React, { useState } from 'react'; // useStateをインポート
import { useSearchParams } from 'react-router-dom';
import { Chessboard } from 'react-chessboard'; // react-chessboardからChessboardをインポート
import ChessBoard from "../components/chessboard";

// import './GamePage.css'; // もし前のステップで作成していたら、これは不要になるかもしれません

export default function GamePage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode'); // "bot" または "local"

  // チェス盤の初期状態 (FEN記法)
  // 'startpos' でも可 (Chessboardライブラリが対応していれば)
  const [gamePosition, setGamePosition] = useState('start');

  // react-chessboard は駒の動きをハンドルする関数を props として受け取ることができます
  // ここでは基本的な表示のみ行い、駒の動きのロジックはまだ実装していません
  function onDrop(sourceSquare, targetSquare, piece) {
    // TODO: ここに駒が動かされたときのロジックを実装します
    // 例: chess.jsライブラリと連携して駒の動きを検証し、状態を更新する
    console.log(`Piece ${piece} moved from ${sourceSquare} to ${targetSquare}`);
    // gamePosition を更新するロジックが必要になります
    // この例ではまだ盤面は更新されません
    return true; // とりあえず常に移動を許可する (実際には検証が必要)
  }

  const boardWidth = 400; // ★ここで boardWidth を 400 と定義しています

  return (
    <div className="game-page" style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>対局画面</h1>
      <p>対戦モード: {mode}</p>
      <div className="board-container">
        <ChessBoard 
          position={gamePosition}
          onPieceDrop={onDrop}
          boardWidth={boardWidth}
        />
      </div>
      {/* 将来的にはここに対局操作ボタンや棋譜表示などを追加できます */}
    </div>
  );
}