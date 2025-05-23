// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const handleBotGame = () => {
    navigate("/game?mode=bot");
  };

  const handleLocalGame = () => {
    navigate("/game?mode=local");
  };

  const handleViewAnalysis = () => {
    navigate("/analysis");
  };

  return (
    <div>
      <h1 className={"text-4xl font-bold my-6"}>ChessMateへようこそ</h1>
      <p>プレイモードを選んでください</p>
      <button onClick={handleBotGame}>Botと対戦</button>
      <button onClick={handleLocalGame}>ローカル対戦</button>
      <button onClick={handleViewAnalysis}>対局解析</button>
    </div>
  );
}
