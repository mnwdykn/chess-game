// src/pages/GamePage.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import ChessBoard from "../components/chessboard";
import useChess from "../hooks/useChess"; // useChessフックのインポート

export default function GamePage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode"); // "bot" または "local" モード取得

  // useChessフックからゲーム状態と操作APIを取得
  const { fen, move, isGameOver, resetGame, history } = useChess();

  /**
   * 駒を動かした際に呼び出される関数
   * 合法手でない場合、false を返して移動を無効化
   */
  function onDrop(sourceSquare, targetSquare, piece) {
    // move() は合法手の場合は move オブジェクトを返し、非合法手では null を返す
    const result = move(sourceSquare, targetSquare);

    // 非合法手は移動しない
    if (!result) {
      console.log(
        `非合法手: ${piece} moved from ${sourceSquare} to ${targetSquare}`
      );
      return false; // 非合法手をキャンセル
    }

    console.log(
      `合法手: ${piece} moved from ${sourceSquare} to ${targetSquare}`
    );

    // ゲーム終了時の処理
    if (isGameOver()) {
      console.log("ゲーム終了!");
    }

    return true; // 合法手の場合、盤面を更新
  }

  const boardWidth = 400; // チェス盤の幅を400pxに設定

  return (
    <div
      className="game-page"
      style={{ textAlign: "center", fontFamily: "sans-serif" }}
    >
      <h1>対局画面</h1>
      <p>対戦モード: {mode}</p>
      <div className="board-container">
        {/* ChessBoardコンポーネントにfen（盤面状態）を渡して盤面を描画 */}
        <ChessBoard
          position={fen} // 現在の盤面状態（FEN形式）を渡す
          onPieceDrop={onDrop} // 駒がドロップされた時の処理
          boardWidth={boardWidth} // 盤面の幅設定
        />
      </div>
      {/* 将来的にはここに対局操作ボタンや棋譜表示などを追加できます */}
    </div>
  );
}
