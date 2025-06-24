import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./car-game.css";

const CarGame = () => {
  const [carLane, setCarLane] = useState(1);
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const startY = useRef(null);
  const endY = useRef(null);
  const navigate = useNavigate();

  const lanes = ["0%", "33.3%", "66.6%"];

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
      if (e.key === "ArrowLeft" && carLane > 0) setCarLane(carLane - 1);
      if (e.key === "ArrowRight" && carLane < 2) setCarLane(carLane + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [carLane]);

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
      setScore((s) => s + 1);
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
    <div
      className="game-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="road">
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

      <div className="score">Skor: {score}</div>

      {gameOver && (
        <div className="game-over">
          <h2>💥 Kaza! Skor: {score}</h2>
          <button onClick={restartGame}>Yeniden Başla</button>
        </div>
      )}

      {/* Her zaman görünen ana sayfa butonu */}
      <button className="home-button" onClick={() => navigate("/")}>
        Ana Sayfaya Dön
      </button>
    </div>
  );
};

export default CarGame;
