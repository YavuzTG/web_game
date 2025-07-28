import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./dino-game.css";

export default function DinoGame() {
  const canvasRef = useRef(null);
  const [dinoY, setDinoY] = useState(100);
  const [jumping, setJumping] = useState(false);
  const [cactusX, setCactusX] = useState(500);
  const [gameOver, setGameOver] = useState(false);
  const [cactusSpeed, setCactusSpeed] = useState(6);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem('bestScoreDino')) || 0
  );
  const [showInstructions, setShowInstructions] = useState(false);

  const gravity = 2;
  const jumpSpeed = 25;

  const velocityRef = useRef(0);
  const animationFrameIdRef = useRef(null);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setCactusSpeed((speed) => +(speed * 1.2).toFixed(2));
    }, 10000);
    return () => clearInterval(interval);
  }, [gameOver]);

  function collisionDetected(dinoRect, cactusRect) {
    return !(
      dinoRect.x + dinoRect.width < cactusRect.x ||
      dinoRect.x > cactusRect.x + cactusRect.width ||
      dinoRect.y + dinoRect.height < cactusRect.y ||
      dinoRect.y > cactusRect.y + cactusRect.height
    );
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

   function drawDino(y) {
  const x = 50;
  
  // Gövde - Modern gradient
  const gradient = ctx.createLinearGradient(x, y, x + 40, y + 40);
  gradient.addColorStop(0, "#4CAF50");
  gradient.addColorStop(1, "#2E7D32");
  ctx.fillStyle = gradient;
  ctx.fillRect(x + 10, y + 10, 20, 20);

  // Kafa - Parlak yeşil
  ctx.fillStyle = "#66BB6A";
  ctx.fillRect(x + 25, y, 15, 15);

  // Göz - Daha büyük ve parlak
  ctx.fillStyle = "white";
  ctx.fillRect(x + 33, y + 3, 5, 5);
  ctx.fillStyle = "#333";
  ctx.fillRect(x + 35, y + 4, 2, 2);

  // Ayaklar - Gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(x + 10, y + 30, 6, 10);
  ctx.fillRect(x + 24, y + 30, 6, 10);

  // Kuyruk - Yumuşak curves
  ctx.fillStyle = "#4CAF50";
  ctx.beginPath();
  ctx.moveTo(x + 10, y + 20);
  ctx.quadraticCurveTo(x - 5, y + 22, x, y + 25);
  ctx.lineTo(x + 10, y + 25);
  ctx.fill();
}


    function drawCactus(x) {
      // Ana gövde - Gradient
      const gradient = ctx.createLinearGradient(x, 110, x + 20, 140);
      gradient.addColorStop(0, "#8BC34A");
      gradient.addColorStop(1, "#4CAF50");
      ctx.fillStyle = gradient;
      ctx.fillRect(x, 110, 10, 30);
      
      // Dal - Sağ
      ctx.fillRect(x + 10, 120, 10, 20);
      
      // Üst kısım
      ctx.fillStyle = "#66BB6A";
      ctx.fillRect(x + 5, 100, 10, 10);
      
      // Dikenler efekti
      ctx.fillStyle = "#2E7D32";
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(x + 2, 105 + (i * 7), 1, 3);
        ctx.fillRect(x + 7, 105 + (i * 7), 1, 3);
        ctx.fillRect(x + 13, 125 + (i * 3), 1, 2);
      }
    }

    function drawScore(currentScore) {
      // Skor background
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(canvas.width - 100, 10, 90, 25);
      
      // Skor border
      ctx.strokeStyle = "#4CAF50";
      ctx.lineWidth = 2;
      ctx.strokeRect(canvas.width - 100, 10, 90, 25);
      
      // Skor text
      ctx.fillStyle = "#2E7D32";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Skor: ${currentScore}`, canvas.width - 55, 25);
    }

    function drawGameOver(finalScore) {
      // Overlay background
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Game Over card
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.fillRect(canvas.width/2 - 150, canvas.height/2 - 60, 300, 120);
      
      // Card border
      ctx.strokeStyle = "#4CAF50";
      ctx.lineWidth = 3;
      ctx.strokeRect(canvas.width/2 - 150, canvas.height/2 - 60, 300, 120);
      
      // Title
      ctx.fillStyle = "#D32F2F";
      ctx.font = "bold 28px Arial";
      ctx.textAlign = "center";
      ctx.fillText("🦕 Oyun Bitti!", canvas.width / 2, canvas.height / 2 - 25);
      
      // Score
      ctx.fillStyle = "#2E7D32";
      ctx.font = "bold 18px Arial";
      ctx.fillText(`Skorun: ${finalScore}`, canvas.width / 2, canvas.height / 2);
      
      // Best Score
      if (finalScore > bestScore) {
        ctx.fillStyle = "#FF9800";
        ctx.font = "bold 14px Arial";
        ctx.fillText("🏆 Yeni Rekor!", canvas.width / 2, canvas.height / 2 + 20);
      }
      
      // Restart text
      ctx.fillStyle = "#666";
      ctx.font = "14px Arial";
      ctx.fillText("Tekrar başlatmak için dokunun", canvas.width / 2, canvas.height / 2 + 40);
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dinoRect = { x: 50, y: dinoY, width: 40, height: 40 };
      const cactusRect = { x: cactusX, y: 100, width: 30, height: 50 };

      if (collisionDetected(dinoRect, cactusRect)) {
        setGameOver(true);
        drawGameOver(score);
        return;
      }

      let newCactusX = cactusX - cactusSpeed;
      if (newCactusX < -30) {
        newCactusX = 500;
        setScore((prev) => {
          const newScore = prev + 1;
          if (newScore > bestScore) {
            setBestScore(newScore);
            localStorage.setItem('bestScoreDino', newScore.toString());
          }
          return newScore;
        });
      }
      setCactusX(newCactusX);

      if (jumping) {
        velocityRef.current -= gravity;
        let newY = dinoY - velocityRef.current;
        if (newY >= 100) {
          newY = 100;
          setJumping(false);
          velocityRef.current = 0;
        }
        setDinoY(newY);
      }

      drawDino(dinoY);
      drawCactus(newCactusX);
      drawScore(score);

      animationFrameIdRef.current = requestAnimationFrame(update);
    }

    if (!gameOver) {
      animationFrameIdRef.current = requestAnimationFrame(update);
    } else {
      drawGameOver(score);
    }

    return () => cancelAnimationFrame(animationFrameIdRef.current);
  }, [dinoY, jumping, cactusX, gameOver, cactusSpeed, score]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code === "Space") {
        e.preventDefault(); // Sayfanın aşağı kaymasını engelle
        handleJump();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Dokunma ve tıklama ile zıplama / restart
  function handleJump() {
    if (gameOver) {
      setGameOver(false);
      setCactusX(500);
      setDinoY(100);
      setJumping(false);
      velocityRef.current = 0;
      setCactusSpeed(6);
      setScore(0);
    } else if (!jumping) {
      setJumping(true);
      velocityRef.current = jumpSpeed;
    }
  }

  return (
    <div className="dino-game-container">
      <div className="game-header">
        <Link to="/" className="back-button">← Geri Dön</Link>
        <h1>🦕 Dino Game</h1>
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
        <canvas
          ref={canvasRef}
          width={500}
          height={150}
          className="game-canvas"
          onClick={handleJump}
          onTouchStart={handleJump}
        />
      </div>

      <div className="game-controls">
        <div className="control-hint">
          <p>🎮 Boşluk tuşu veya dokunarak zıpla!</p>
        </div>
      </div>

      {showInstructions && (
        <div className="instructions-overlay">
          <div className="instructions-card">
            <div className="instructions-header">
              <h2>🦕 Nasıl Oynanır?</h2>
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
                  <p>Dinozor ile kaktüslere çarpmadan kaç!</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-icon">⌨️</div>
                <div className="instruction-text">
                  <h3>Kontroller</h3>
                  <p>Boşluk tuşu ile zıpla. Mobilde ekrana dokun.</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-icon">🌵</div>
                <div className="instruction-text">
                  <h3>Oyun Kuralı</h3>
                  <p>Kaktüslere çarpmadan kaç. Oyun gittikçe hızlanır!</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-icon">🏆</div>
                <div className="instruction-text">
                  <h3>Skor</h3>
                  <p>Her geçtiğin kaktüs için 1 puan kazanırsın!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
