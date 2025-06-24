import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";  // <-- bunu ekle
import "./dino-game.css";

export default function DinoGame() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();  // <-- useNavigate hook'u

  const [dinoY, setDinoY] = useState(120);
  const [jumping, setJumping] = useState(false);
  const [cactusX, setCactusX] = useState(600);
  const [gameOver, setGameOver] = useState(false);
  const [cactusSpeed, setCactusSpeed] = useState(6);
  const [score, setScore] = useState(0);

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
      ctx.fillStyle = "black";
      ctx.fillRect(50, y, 40, 40);
    }

    function drawCactus(x) {
      ctx.fillStyle = "green";
      ctx.fillRect(x, 130, 10, 30);
      ctx.fillRect(x + 10, 140, 10, 20);
      ctx.fillRect(x + 5, 120, 10, 10);
    }

    function drawScore(currentScore) {
      ctx.fillStyle = "#555";
      ctx.font = "18px Arial";
      ctx.textAlign = "right";
      ctx.fillText(`Skor: ${currentScore}`, canvas.width - 20, 30);
    }

    function drawGameOver(finalScore) {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.font = "40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Oyun Bitti!", canvas.width / 2, canvas.height / 2 - 30);

      ctx.font = "24px Arial";
      ctx.fillText(`Skorun: ${finalScore}`, canvas.width / 2, canvas.height / 2 + 10);

      ctx.font = "18px Arial";
      ctx.fillText(
        "Tekrar başlatmak için boşluk tuşuna bas",
        canvas.width / 2,
        canvas.height / 2 + 50
      );
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dinoRect = { x: 50, y: dinoY, width: 40, height: 40 };
      const cactusRect = { x: cactusX, y: 120, width: 30, height: 50 };

      if (collisionDetected(dinoRect, cactusRect)) {
        setGameOver(true);
        drawGameOver(score);
        return;
      }

      let newCactusX = cactusX - cactusSpeed;

      if (newCactusX < -30) {
        newCactusX = 600;
        setScore((prev) => prev + 1);
      }

      setCactusX(newCactusX);

      if (jumping) {
        velocityRef.current -= gravity;
        let newY = dinoY - velocityRef.current;
        if (newY >= 120) {
          newY = 120;
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
        if (gameOver) {
          setGameOver(false);
          setCactusX(600);
          setDinoY(120);
          setJumping(false);
          velocityRef.current = 0;
          setCactusSpeed(6);
          setScore(0);
        } else if (!jumping) {
          setJumping(true);
          velocityRef.current = jumpSpeed;
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jumping, gameOver]);

  // Ana sayfaya yönlendirme fonksiyonu
  function goHome() {
    navigate("/");
  }

  return (
    <div className="dino-game">
      <canvas
        ref={canvasRef}
        width={600}
        height={180}
        className="game-canvas"
      />
      {!gameOver && <p>Boşluk tuşuna basarak zıpla! Skorun ekranda gözüküyor.</p>}

      <button className="btn-home" onClick={goHome}>
        Ana Sayfaya Dön
      </button>
    </div>
  );
}
