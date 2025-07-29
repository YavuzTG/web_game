import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./f1-wordle.css";
import pilots from "./f1-wordle-data";

const F1Wordle = ({ onNewGame }) => {
  const navigate = useNavigate();
  const usedPilots = useRef(new Set());
  
  const [answer, setAnswer] = useState(null);
  const [history, setHistory] = useState([]);
  const [guess, setGuess] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [allUsed, setAllUsed] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!answer) {
      handleNewGame();
    }
  }, []);

  useEffect(() => {
    let interval;
    if (startTime && !gameOver) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [startTime, gameOver]);

  const formatTime = (time) => {
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const selectNewPilot = () => {
    const unusedPilots = pilots.filter(p => !usedPilots.current.has(p.name));
    
    if (unusedPilots.length === 0) {
      setAllUsed(true);
      return null;
    }

    const randomIndex = Math.floor(Math.random() * unusedPilots.length);
    const selectedPilot = unusedPilots[randomIndex];
    usedPilots.current.add(selectedPilot.name);
    
    return selectedPilot;
  };

  const handleNewGame = () => {
    if (usedPilots.current.size >= pilots.length) {
      setAllUsed(true);
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
      setStartTime(Date.now());
      setElapsedTime(0);
      setGamesPlayed(prev => prev + 1);
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
    setFilteredSuggestions([]);

    if (pilotGuess.name === answer.name) {
      setGameOver(true);
      setCorrectGuesses(prev => prev + 1);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const resetAllPilots = () => {
    usedPilots.current.clear();
    setAllUsed(false);
    handleNewGame();
  };

  if (allUsed) {
    return (
      <div className="modern-container">
        <div className="modern-header">
          <h1>🏁 F1 Wordle</h1>
          <div className="header-controls">
            <button onClick={handleBackToHome} className="btn-secondary">Ana Sayfa</button>
          </div>
        </div>

        <div className="modern-game">
          <div className="all-used-message">
            <h2>🎉 Tüm pilotlar kullanıldı!</h2>
            <p>Harika! Tüm F1 pilotlarını tahmin ettin.</p>
            <button onClick={resetAllPilots} className="btn-primary">
              Listeyi Sıfırla ve Yeniden Başla
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-container">
      <div className="modern-header">
        <h1>🏁 F1 Wordle</h1>
        <div className="stats">
          <span>Oyun: {gamesPlayed}</span>
          <span>Doğru: {correctGuesses}</span>
          <span>Süre: {formatTime(elapsedTime)}</span>
        </div>
        <div className="header-controls">
          <button onClick={handleBackToHome} className="btn-secondary">Ana Sayfa</button>
          <button onClick={handleNewGame} className="btn-primary">Yeni Oyun</button>
        </div>
      </div>

      <div className="modern-game">
        <div className="f1-game-area">
          {/* Tahmin girişi */}
          <div className="input-section">
            <div className="input-container">
              <input
                type="text"
                value={guess}
                onChange={handleChange}
                placeholder="Pilot adı yazın..."
                disabled={gameOver}
                className="pilot-input"
              />
              <button 
                onClick={handleGuess} 
                disabled={gameOver || !guess.trim()}
                className="guess-btn"
              >
                Tahmin Et
              </button>
            </div>
            {filteredSuggestions.length > 0 && (
              <ul className="suggestions">
                {filteredSuggestions.slice(0, 5).map((name, index) => (
                  <li key={index} onClick={() => handleSelectSuggestion(name)}>
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Başarı mesajı */}
          {gameOver && (
            <div className="win-message">
              <h3>🎉 Tebrikler!</h3>
              <p>Doğru pilot: <strong>{answer.name}</strong></p>
              <p>Süre: {formatTime(elapsedTime)}</p>
            </div>
          )}

          {/* Tahmin tablosu */}
          {history.length > 0 && (
            <div className="history-section">
              <div className="table-header">
                <div className="col-name">Pilot</div>
                <div className="col-country">Ülke</div>
                <div className="col-team">Takım</div>
                <div className="col-points">Puan</div>
                <div className="col-titles">Şampiyonluk</div>
                <div className="col-birth">Doğum</div>
              </div>
              
              <div className="history-list">
                {history.map((h, idx) => {
                  const pilotData = pilots.find((p) => p.name === h.name);
                  return (
                    <div key={idx} className="guess-row">
                      <div className="col-name">{h.name}</div>
                      <div className={`col-country ${h.country}`}>
                        {pilotData?.country || "Bilinmiyor"}
                        <span className="status-icon">
                          {h.country === "correct" ? "✅" : "❌"}
                        </span>
                      </div>
                      <div className={`col-team ${h.team}`}>
                        {pilotData?.team}
                        <span className="status-icon">
                          {h.team === "correct" ? "✅" : "❌"}
                        </span>
                      </div>
                      <div className="col-points">
                        <span className="arrow">{h.points.status}</span>
                        {h.points.value}
                      </div>
                      <div className="col-titles">
                        <span className="arrow">{h.titles.status}</span>
                        {h.titles.value}
                      </div>
                      <div className="col-birth">
                        <span className="arrow">{h.birthYear.status}</span>
                        {h.birthYear.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="modern-instructions">
        <h3>Nasıl Oynanır</h3>
        <ul>
          <li>🏎️ Gizli F1 pilotunu tahmin etmeye çalışın</li>
          <li>📝 Pilot adını yazın veya önerilerden seçin</li>
          <li>✅ Yeşil tik doğru eşleşmeyi gösterir</li>
          <li>🔼🔽 Oklar sayısal değerlerin yönünü gösterir</li>
          <li>🎯 Doğru pilotu bulana kadar tahmin etmeye devam edin</li>
          <li>📊 İstatistiklerinizi takip edin ve rekorlarınızı kırın</li>
        </ul>
      </div>
    </div>
  );
};

export default F1Wordle;
