import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./f1-wordle.css";
import pilots from "./f1-wordle-data";

const F1Wordle = ({ onNewGame }) => {
  const navigate = useNavigate();
  const usedPilots = useRef(new Set());

  const [answer, setAnswer] = useState(null);
  const [guess, setGuess] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [allUsed, setAllUsed] = useState(false);

  const selectNewPilot = () => {
    const availablePilots = pilots.filter(
      (p) => !usedPilots.current.has(p.name)
    );

    if (availablePilots.length === 0) {
      setAllUsed(true);
      return null;
    }

    const randomPilot =
      availablePilots[Math.floor(Math.random() * availablePilots.length)];

    usedPilots.current.add(randomPilot.name);
    return randomPilot;
  };

  useEffect(() => {
    const pilot = selectNewPilot();
    if (pilot) {
      setAnswer(pilot);
      setGameOver(false);
      setHistory([]);
      setGuess("");
      setFilteredSuggestions([]);
      setAllUsed(false);
    }
  }, []);

  const handleNewGame = () => {
    if (allUsed) {
      alert("Tüm pilotlar kullanıldı!");
      return;
    }

    const pilot = selectNewPilot();
    if (pilot) {
      setAnswer(pilot);
      setGameOver(false);
      setHistory([]);
      setGuess("");
      setFilteredSuggestions([]);
      setAllUsed(false);
    }

    if (onNewGame) onNewGame();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setGuess(value);

    const suggestions = pilots
      .filter((p) => p.name.toLowerCase().includes(value.toLowerCase()))
      .map((p) => p.name);

    setFilteredSuggestions(suggestions);
  };

  const handleSelectSuggestion = (name) => {
    setGuess(name);
    setFilteredSuggestions([]);
  };

  const handleGuess = () => {
    const pilotGuess = pilots.find(
      (p) => p.name.toLowerCase() === guess.toLowerCase()
    );
    if (!pilotGuess) {
      alert("Geçerli bir pilot adı girin!");
      return;
    }

    const getArrow = (value, actual) => {
      if (value === actual) return "✅";
      return value > actual ? "🔽" : "🔼";
    };

    const result = {
      name: pilotGuess.name,
      country: pilotGuess.country === answer.country ? "correct" : "wrong",
      team: pilotGuess.team === answer.team ? "correct" : "wrong",
      points: {
        value: pilotGuess.totalPoints,
        status: getArrow(pilotGuess.totalPoints, answer.totalPoints),
      },
      titles: {
        value: pilotGuess.titles,
        status: getArrow(pilotGuess.titles, answer.titles),
      },
      birthYear: {
        value: pilotGuess.birthYear,
        status: getArrow(pilotGuess.birthYear, answer.birthYear),
      },
    };

    setHistory((prev) => [result, ...prev]);
    setGuess("");

    if (pilotGuess.name === answer.name) {
      setGameOver(true);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (allUsed) {
    return (
      <div
        className="f1-wordle-container"
        style={{ textAlign: "center", color: "white" }}
      >
        <h2>Tüm pilotlar kullanıldı!</h2>
        <button
          onClick={() => {
            usedPilots.current.clear();
            setAllUsed(false);
            handleNewGame();
          }}
          style={{
            backgroundColor: "#ff1c1c",
            color: "white",
            padding: "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Listeyi sıfırla ve yeniden başla
        </button>
      </div>
    );
  }

  return (
    <div className="f1-wordle-container">
      <h1 className="title">🏁 F1 Wordle Tahmin Oyunu</h1>
      <p className="subtitle">Pilot adını yaz ya da seç ve tahmin et!</p>

      {/* Tahmin girişi */}
      <div className="input-section">
        <input
          type="text"
          value={guess}
          onChange={handleChange}
          placeholder="Pilot adı yaz..."
          disabled={gameOver}
        />
        <button onClick={handleGuess} disabled={gameOver}>
          Tahmin Et
        </button>
        {filteredSuggestions.length > 0 && (
          <ul className="suggestions">
            {filteredSuggestions.map((name, index) => (
              <li key={index} onClick={() => handleSelectSuggestion(name)}>
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Başlık */}
      {history.length > 0 && (
        <div
          className="header-info"
          style={{
            display: "flex",
            justifyContent: "space-around",
            fontWeight: "bold",
            marginTop: "20px",
            color: "#ff1c1c",
            textShadow: "1px 1px 2px black",
          }}
        >
          <div style={{ minWidth: "120px" }}>Ad</div>
          <div style={{ minWidth: "80px" }}>Ülke</div>
          <div style={{ minWidth: "120px" }}>Takım</div>
          <div style={{ minWidth: "60px" }}>Puan</div>
          <div style={{ minWidth: "90px" }}>Şampiyonluk</div>
          <div style={{ minWidth: "90px" }}>Doğum Yılı</div>
        </div>
      )}

      {/* Tahmin geçmişi */}
      <div className="history">
        {history.map((h, idx) => {
          const pilotData = pilots.find((p) => p.name === h.name);
          return (
            <div
              key={idx}
              className="guess-row"
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginBottom: "6px",
                padding: "6px 0",
                borderBottom: "1px solid #444",
                color: "white",
              }}
            >
              <div style={{ minWidth: "120px" }}>{h.name}</div>
              <div style={{ minWidth: "80px" }}>
                {pilotData?.country || "Bilinmiyor"}{" "}
                {h.country === "correct" ? "✅" : "❌"}
              </div>
              <div style={{ minWidth: "120px" }}>
                {pilotData?.team} {h.team === "correct" ? "✅" : "❌"}
              </div>
              <div style={{ minWidth: "60px" }}>
                {h.points.status} {h.points.value}
              </div>
              <div style={{ minWidth: "90px" }}>
                {h.titles.status} {h.titles.value}
              </div>
              <div style={{ minWidth: "90px" }}>
                {h.birthYear.status} {h.birthYear.value}
              </div>
            </div>
          );
        })}
      </div>

      {gameOver && <div className="win-message">🎉 Doğru pilot: {answer.name}</div>}

      {/* Butonlar */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <button
          onClick={handleBackToHome}
          style={{
            backgroundColor: "#555",
            color: "#fff",
            borderRadius: "6px",
            padding: "8px 14px",
            cursor: "pointer",
          }}
        >
          Ana Sayfa
        </button>
        <button
          onClick={handleNewGame}
          style={{
            backgroundColor: "#ff1c1c",
            color: "#fff",
            borderRadius: "6px",
            padding: "8px 14px",
            cursor: "pointer",
          }}
        >
          Yeni Oyun
        </button>
      </div>
    </div>
  );
};

export default F1Wordle;
