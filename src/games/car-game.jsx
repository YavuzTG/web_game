import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./car-game.css";

const CarGame = () => {
  const [carLane, setCarLane] = useState(1);
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem('bestScoreCar')) || 0
  );
  const [showInstructions, setShowInstructions] = useState(false);
  const startY = useRef(null);
  const endY = useRef(null);

  const lanes = ["8%", "41.5%", "75%"];

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    endY.current = e.changedTouches[0].clientX;
    const delta = endY.current - startY.current;

    if (delta > 50 && carLane < 2) setCarLane(carLane + 1);
    else if (delta < -50 && carLane > 0) setCarLane(carLane - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || showInstructions) return;
      e.preventDefault();
      if (e.key === "ArrowLeft" && carLane > 0) setCarLane(carLane - 1);
      if (e.key === "ArrowRight" && carLane < 2) setCarLane(carLane + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [carLane, gameOver, showInstructions]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const newLane = Math.floor(Math.random() * 3);
      const id = Date.now();
      setObstacles((prev) => [...prev, { id, lane: newLane, top: 0 }]);
    }, 1200);
    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setObstacles((prev) =>
        prev
          .map((obs) => ({ ...obs, top: obs.top + 5 }))
          .filter((obs) => obs.top < 100)
      );
      setScore((s) => {
        const newScore = s + 1;
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('bestScoreCar', newScore.toString());
        }
        return newScore;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    obstacles.forEach((obs) => {
      if (obs.lane === carLane && obs.top > 85) {
        setGameOver(true);
      }
    });
  }, [obstacles, carLane]);

  const restartGame = () => {
    setGameOver(false);
    setObstacles([]);
    setCarLane(1);
    setScore(0);
  };

  return (
    <div className="car-game-container">
      <div className="game-header">
        <Link to="/" className="back-button">← Geri Dön</Link>
        <h1>🚗 Car Game</h1>
        <button 
          className="help-button"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          ❓
        </button>
      </div>

      <div className="score-container">
        <div className="score-card">
          <div className="score-label">Skor</div>
          <div className="score-value">{score}</div>
        </div>
        <div className="score-card best">
          <div className="score-label">En İyi</div>
          <div className="score-value">{bestScore}</div>
        </div>
      </div>

      <div className="game-area">
        <div
          className="road"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {obstacles.map((obs) => (
            <img
              key={obs.id}
              src="/assets/car/bariyer.png"
              className="obstacle"
              style={{
                left: lanes[obs.lane],
                top: `${obs.top}%`,
              }}
              alt="engel"
            />
          ))}
          <img
            src="/assets/car/car.png"
            className="car"
            style={{ left: lanes[carLane] }}
            alt="araba"
          />
        </div>
      </div>

      <div className="game-controls">
        <div className="control-hint">
          <p>🎮 Ok tuşları veya kaydırma ile hareket et!</p>
        </div>
      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-card">
            <h2>💥 Kaza!</h2>
            <div className="final-score">
              <span>Final Skor: {score}</span>
              {score === bestScore && <span className="new-record">🏆 Yeni Rekor!</span>}
            </div>
            <div className="game-over-actions">
              <button onClick={restartGame} className="restart-btn">
                🔄 Tekrar Dene
              </button>
              <Link to="/" className="home-btn">
                🏠 Ana Sayfa
              </Link>
            </div>
          </div>
        </div>
      )}

      {showInstructions && (
        <div className="instructions-overlay">
          <div className="instructions-card">
            <div className="instructions-header">
              <h2>🚗 Nasıl Oynanır?</h2>
              <button 
                className="close-btn"
                onClick={() => setShowInstructions(false)}
              >
                ✕
              </button>
            </div>
            <div className="instructions-content">
              <div className="instruction-item">
                <div className="instruction-icon">🎯</div>
                <div className="instruction-text">
                  <h3>Amaç</h3>
                  <p>Arabanla engellere çarpmadan kaç!</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-icon">⌨️</div>
                <div className="instruction-text">
                  <h3>Kontroller</h3>
                  <p>Sol/Sağ ok tuşları ile şerit değiştir. Mobilde kaydır.</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-icon">🚧</div>
                <div className="instruction-text">
                  <h3>Oyun Kuralı</h3>
                  <p>Bariyerlere çarpmadan mümkün olduğunca uzun süre kaç!</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-icon">🏆</div>
                <div className="instruction-text">
                  <h3>Skor</h3>
                  <p>Her saniye boyunca canlı kalırsan puan kazanırsın!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarGame;
