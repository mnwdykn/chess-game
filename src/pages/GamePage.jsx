// src/pages/GamePage.jsx
import { useSearchParams } from "react-router-dom";

export default function GamePage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode"); // "bot" または "local"

  return (
    <div>
      <h1>対局画面</h1>
      <p>対戦モード: {mode}</p>
    </div>
  );
}
