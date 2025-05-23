// src/pages/GamePage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ChessBoard from "../components/chessboard";
import useChess from "../hooks/useChess";
import useStockfish from "../hooks/useStockfish";

export default function GamePage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode"); // "bot" または "local" モード取得

  // useChessフックからゲーム状態と操作APIを取得
  const { fen, move, isGameOver, resetGame, history, getLegalMoves, chess } =
    useChess();

  // 手番管理の状態
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  // 選択中の駒の位置
  const [selectedSquare, setSelectedSquare] = useState(null);
  // 合法手のリスト
  const [legalMoves, setLegalMoves] = useState([]);
  // ゲーム終了状態
  const [gameResult, setGameResult] = useState(null);

  // Stockfishエンジンの初期化（Botモードの場合のみ）
  const {
    isReady: isEngineReady,
    isAnalyzing,
    bestMove,
    analyzePosition,
    stopAnalysis,
    currentDifficulty,
  } = useStockfish({
    difficulty: 20,
    thinkingTime: 1000,
  });

  // 合法手の更新
  useEffect(() => {
    if (selectedSquare) {
      const moves = getLegalMoves(selectedSquare);
      setLegalMoves(moves);
    } else {
      setLegalMoves([]);
    }
  }, [selectedSquare, getLegalMoves]);

  // ゲーム終了のチェック
  useEffect(() => {
    if (isGameOver()) {
      const result = getGameResult();
      setGameResult(result);
    }
  }, [fen, isGameOver]);

  // ゲーム結果の取得
  const getGameResult = useCallback(() => {
    if (!isGameOver()) return null;

    if (chess.isCheckmate()) {
      return chess.turn() === "w"
        ? "黒の勝利！チェックメイト！"
        : "白の勝利！チェックメイト！";
    }
    if (chess.isDraw()) {
      if (chess.isStalemate()) return "ステイルメイト！引き分けです。";
      if (chess.isThreefoldRepetition()) return "同一局面3回！引き分けです。";
      if (chess.isInsufficientMaterial()) return "駒不足！引き分けです。";
      if (chess.isDraw()) return "引き分けです。";
    }
    return null;
  }, [isGameOver, chess]);

  // チェック状態の表示
  const getCheckStatus = useCallback(() => {
    if (chess.isCheck()) {
      return chess.turn() === "w"
        ? "白がチェックされています"
        : "黒がチェックされています";
    }
    return null;
  }, [chess]);

  // 再対戦の処理
  const handleNewGame = useCallback(() => {
    resetGame();
    setGameResult(null);
    setIsPlayerTurn(true);
    setSelectedSquare(null);
    setLegalMoves([]);
  }, [resetGame]);

  // Botの手番を処理
  useEffect(() => {
    if (
      mode === "bot" &&
      isEngineReady &&
      !isAnalyzing &&
      !isPlayerTurn &&
      !gameResult
    ) {
      const currentFen = fen;
      analyzePosition(currentFen);
    }
  }, [
    mode,
    isEngineReady,
    fen,
    isAnalyzing,
    analyzePosition,
    isPlayerTurn,
    gameResult,
  ]);

  // Botの最善手を実行
  useEffect(() => {
    if (
      mode === "bot" &&
      bestMove &&
      !isAnalyzing &&
      !isPlayerTurn &&
      !gameResult
    ) {
      const result = move(bestMove.substring(0, 2), bestMove.substring(2, 4));
      if (result) {
        console.log(`Botの手: ${bestMove}`);
        setIsPlayerTurn(true);
      }
    }
  }, [mode, bestMove, isAnalyzing, move, isPlayerTurn, gameResult]);

  /**
   * 駒を動かした際に呼び出される関数
   */
  function onDrop(sourceSquare, targetSquare, piece) {
    if (mode === "bot" && !isPlayerTurn) {
      console.log("Botの手番です");
      return false;
    }

    if (mode === "bot") {
      stopAnalysis();
    }

    const result = move(sourceSquare, targetSquare);

    if (!result) {
      console.log(
        `非合法手: ${piece} moved from ${sourceSquare} to ${targetSquare}`
      );
      return false;
    }

    console.log(
      `合法手: ${piece} moved from ${sourceSquare} to ${targetSquare}`
    );

    if (mode === "bot") {
      setIsPlayerTurn(false);
    }

    setSelectedSquare(null);
    setLegalMoves([]);

    return true;
  }

  /**
   * 駒をクリックした際の処理
   */
  const onSquareClick = useCallback(
    (square) => {
      if (gameResult) return; // ゲーム終了時は何もしない
      if (mode === "bot" && !isPlayerTurn) return; // Botの手番時は何もしない

      setSelectedSquare(square);
    },
    [mode, isPlayerTurn, gameResult]
  );

  const boardWidth = 400;

  return (
    <div
      className="game-page"
      style={{ textAlign: "center", fontFamily: "sans-serif" }}
    >
      <h1>対局画面</h1>
      <p>対戦モード: {mode}</p>
      {mode === "bot" && (
        <div className="bot-status">
          <p>エンジン状態: {isEngineReady ? "準備完了" : "準備中..."}</p>
          <p>現在の手番: {isPlayerTurn ? "プレイヤー" : "Bot"}</p>
          <p>Botの難易度: {currentDifficulty}/20</p>
          {isAnalyzing && <p>Bot思考中...</p>}
        </div>
      )}
      <div className="board-container">
        <ChessBoard
          position={fen}
          onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
          boardWidth={boardWidth}
          arePiecesDraggable={mode !== "bot" || isPlayerTurn}
          customSquareStyles={{
            ...(selectedSquare && {
              [selectedSquare]: {
                backgroundColor: "rgba(255, 255, 0, 0.4)",
              },
            }),
            ...legalMoves.reduce((styles, move) => {
              styles[move.to] = {
                backgroundColor: "rgba(0, 255, 0, 0.4)",
              };
              return styles;
            }, {}),
          }}
        />
      </div>
      {getCheckStatus() && !gameResult && (
        <div
          className="check-status"
          style={{ color: "red", fontWeight: "bold", margin: "10px 0" }}
        >
          {getCheckStatus()}
        </div>
      )}
      {gameResult && (
        <div className="game-result">
          <h2>{gameResult}</h2>
          <button
            onClick={handleNewGame}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            再対戦
          </button>
        </div>
      )}
    </div>
  );
}
