// src/components/Chessboard.jsx
import React from "react";
import "./Chessboard.css";
import { Chessboard } from "react-chessboard"; // react-chessboardからChessboardをインポート

const ChessBoard = ({
  position,
  onPieceDrop,
  boardWidth,
  onSquareClick,
  customSquareStyles,
  arePiecesDraggable,
  ...props
}) => {
  return (
    <div style={{ width: boardWidth || "400px", margin: "auto" }}>
      <Chessboard
        id="MyCustomChessboard" // idは任意ですが、ユニークなものが良いでしょう
        position={position}
        onPieceDrop={onPieceDrop}
        onSquareClick={onSquareClick}
        customSquareStyles={customSquareStyles}
        boardWidth={boardWidth || 400}
        arePiecesDraggable={arePiecesDraggable}
        {...props}
      />
      {/* ここに盤面に関する追加のUI（例：ラベル、特定の装飾など）を
        将来的に追加することもできます */}
    </div>
  );
};

export default ChessBoard;
