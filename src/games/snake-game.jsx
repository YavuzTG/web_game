import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './snake-game.css';

const SnakeGame = () => {
  const gridSize = 20;
  const canvasSize = 400;
  
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('snakeHighScore')) || 0
  );
  const [gameStatus, setGameStatus] = useState('Başlamak için SPACE tuşuna basın!');
  const [speed, setSpeed] = useState(150);

  // Yeni yem pozisyonu oluştur
  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * (canvasSize / gridSize)),
      y: Math.floor(Math.random() * (canvasSize / gridSize))
    };
  }, [canvasSize, gridSize]);

  // Oyun döngüsü
  const gameLoop = useCallback(() => {
    if (!gameRunning) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      // Yılanın kafasını hareket ettir
      head.x += direction.x;
      head.y += direction.y;
      
      // Duvarlarla çarpışma kontrolü
      if (head.x < 0 || head.x >= canvasSize / gridSize || 
          head.y < 0 || head.y >= canvasSize / gridSize) {
        setGameRunning(false);
        setGameStatus(`Oyun Bitti! Skor: ${score}`);
        
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snakeHighScore', score.toString());
          setGameStatus(`Yeni Rekor! Skor: ${score}`);
        }
        return currentSnake;
      }
      
      // Kendine çarpma kontrolü
      for (let segment of newSnake) {
        if (head.x === segment.x && head.y === segment.y) {
          setGameRunning(false);
          setGameStatus(`Oyun Bitti! Skor: ${score}`);
          
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snakeHighScore', score.toString());
            setGameStatus(`Yeni Rekor! Skor: ${score}`);
          }
          return currentSnake;
        }
      }
      
      newSnake.unshift(head);
      
      // Yem yeme kontrolü
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
        
        // Hız artırma (her 50 puanda)
        if ((score + 10) % 50 === 0 && speed > 80) {
          setSpeed(prev => prev - 10);
        }
        
        // Yem sesi
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 800;
          oscillator.type = 'square';
          
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          
          setTimeout(() => {
            if (audioContext.state !== 'closed') {
              audioContext.close();
            }
          }, 150);
        } catch (error) {
          console.log('Ses çalınamadı:', error);
        }
      } else {
        newSnake.pop();
      }
      
      return newSnake;
    });
  }, [gameRunning, direction, food, score, highScore, speed, generateFood, canvasSize, gridSize]);

  // Oyun başlatma
  const startGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 1, y: 0 });
    setGameRunning(true);
    setScore(0);
    setSpeed(150);
    setGameStatus('Yemek topluyorsun!');
  }, [generateFood]);

  // Oyun durdurma
  const stopGame = () => {
    setGameRunning(false);
    setDirection({ x: 0, y: 0 });
    setGameStatus('Oyun durduruldu!');
  };

  // Klavye kontrolü
  const handleKeyPress = useCallback((event) => {
    if (!gameRunning && event.code === 'Space') {
      event.preventDefault();
      startGame();
      return;
    }
    
    if (!gameRunning) return;
    
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
      case ' ':
        event.preventDefault();
        stopGame();
        break;
      default:
        break;
    }
  }, [gameRunning, direction, startGame]);

  // Event listener ekle/kaldır
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Oyun döngüsü timer
  useEffect(() => {
    const interval = setInterval(gameLoop, speed);
    return () => clearInterval(interval);
  }, [gameLoop, speed]);

  // Grid çizimi
  const renderGrid = () => {
    const cells = [];
    const cellCount = canvasSize / gridSize;
    
    for (let y = 0; y < cellCount; y++) {
      for (let x = 0; x < cellCount; x++) {
        let className = 'grid-cell';
        
        // Yılan kontrolü
        const isSnakeHead = snake.length > 0 && snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.some((segment, index) => 
          index > 0 && segment.x === x && segment.y === y
        );
        
        // Yem kontrolü
        const isFood = food.x === x && food.y === y;
        
        if (isSnakeHead) className += ' snake-head';
        else if (isSnakeBody) className += ' snake-body';
        else if (isFood) className += ' food';
        
        cells.push(
          <div
            key={`${x}-${y}`}
            className={className}
            style={{
              left: x * gridSize,
              top: y * gridSize,
              width: gridSize,
              height: gridSize
            }}
          >
            {isSnakeHead && '🐍'}
            {isFood && '🍎'}
          </div>
        );
      }
    }
    
    return cells;
  };

  return (
    <div className="snake-container">
      <div className="snake-header">
        <Link to="/" className="back-button">← Ana Sayfa</Link>
        <h1>🐍 Snake Game</h1>
      </div>

      <div className="snake-game">
        <div className="game-info">
          <div className="score-board">
            <div className="score">Skor: {score}</div>
            <div className="length">Uzunluk: {snake.length}</div>
            <div className="high-score">En Yüksek: {highScore}</div>
          </div>
          <div className="game-status">{gameStatus}</div>
        </div>

        <div className="game-area">
          <div 
            className="game-grid"
            style={{ width: canvasSize, height: canvasSize }}
          >
            {renderGrid()}
          </div>
        </div>

        <div className="game-controls">
          {!gameRunning ? (
            <button className="start-button" onClick={startGame}>
              {score > 0 ? 'Tekrar Oyna' : 'Başla'}
            </button>
          ) : (
            <button className="stop-button" onClick={stopGame}>
              Durdur
            </button>
          )}
        </div>

        <div className="controls-info">
          <h3>Kontroller</h3>
          <div className="control-grid">
            <div className="control-item">
              <span className="key">↑ ↓ ← →</span>
              <span>Yön tuşları ile hareket</span>
            </div>
            <div className="control-item">
              <span className="key">SPACE</span>
              <span>Başlat / Durdur</span>
            </div>
          </div>
        </div>

        <div className="game-instructions">
          <h3>Nasıl Oynanır?</h3>
          <ul>
            <li>Yılanı yön tuşları ile kontrol edin</li>
            <li>Kırmızı elmaları toplayın</li>
            <li>Her elma yılanı büyütür ve 10 puan verir</li>
            <li>Duvarlara veya kendinize çarpmayın</li>
            <li>Hız zamanla artar!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
