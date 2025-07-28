import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './game-2048.css';

const GRID_SIZE = 4;

const Game2048 = () => {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem('bestScore2048')) || 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameOver || showInstructions) return;
      event.preventDefault();
      switch (event.key) {
        case 'ArrowUp':
          move('up');
          break;
        case 'ArrowDown':
          move('down');
          break;
        case 'ArrowLeft':
          move('left');
          break;
        case 'ArrowRight':
          move('right');
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameOver, showInstructions]);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e) => {
    if (gameOver || showInstructions) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0) {
        move('right');
      } else {
        move('left');
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        move('down');
      } else {
        move('up');
      }
    }
  };

  const initializeGame = () => {
    const emptyGrid = Array(GRID_SIZE * GRID_SIZE).fill('');
    addNewNumber(emptyGrid);
    addNewNumber(emptyGrid);
    setGrid(emptyGrid);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  };

  const addNewNumber = (currentGrid = [...grid]) => {
    const emptyCells = currentGrid
      .map((val, index) => (val === '' ? index : null))
      .filter((val) => val !== null);
    if (emptyCells.length === 0) return currentGrid;
    const randomIndex =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    currentGrid[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    return currentGrid;
  };

  const move = useCallback((direction) => {
    if (gameOver || showInstructions) return;

    const newGrid = [...grid];
    const size = GRID_SIZE;
    let moved = false;
    let newScore = score;

    const getIndex = (x, y) => y * size + x;

    // Get line of tiles based on direction
    const getLine = (lineIndex) => {
      const line = [];
      for (let i = 0; i < size; i++) {
        if (direction === 'left' || direction === 'right') {
          line.push(newGrid[getIndex(i, lineIndex)]);
        } else {
          line.push(newGrid[getIndex(lineIndex, i)]);
        }
      }
      return direction === 'right' || direction === 'down' ? line.reverse() : line;
    };

    // Set line of tiles based on direction
    const setLine = (lineIndex, line) => {
      const finalLine = direction === 'right' || direction === 'down' ? [...line].reverse() : line;
      for (let i = 0; i < size; i++) {
        if (direction === 'left' || direction === 'right') {
          newGrid[getIndex(i, lineIndex)] = finalLine[i];
        } else {
          newGrid[getIndex(lineIndex, i)] = finalLine[i];
        }
      }
    };

    // Process each line
    for (let lineIndex = 0; lineIndex < size; lineIndex++) {
      const line = getLine(lineIndex);
      const originalLine = [...line];
      
      // Remove empty cells
      const nonEmpty = line.filter(cell => cell !== '');
      
      // Merge adjacent identical tiles
      const merged = [];
      let i = 0;
      while (i < nonEmpty.length) {
        if (i < nonEmpty.length - 1 && nonEmpty[i] === nonEmpty[i + 1]) {
          // Merge tiles
          const mergedValue = nonEmpty[i] * 2;
          merged.push(mergedValue);
          newScore += mergedValue;
          
          // Check for 2048 win condition
          if (mergedValue === 2048 && !gameWon) {
            setGameWon(true);
          }
          
          i += 2; // Skip both merged tiles
        } else {
          merged.push(nonEmpty[i]);
          i += 1;
        }
      }
      
      // Add empty cells back
      while (merged.length < size) {
        merged.push('');
      }
      
      // Check if line changed
      for (let j = 0; j < size; j++) {
        if (originalLine[j] !== merged[j]) {
          moved = true;
          break;
        }
      }
      
      setLine(lineIndex, merged);
    }

    if (moved) {
      const added = addNewNumber(newGrid);
      setGrid(added);
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('bestScore2048', newScore.toString());
      }
      if (!canMove(added)) setGameOver(true);
    }
  }, [grid, gameOver, showInstructions, score, bestScore, gameWon]);

  const canMove = (grid) => {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const index = y * GRID_SIZE + x;
        if (grid[index] === '') return true;
        const current = grid[index];
        const neighbors = [
          y > 0 ? grid[(y - 1) * GRID_SIZE + x] : null,
          y < 3 ? grid[(y + 1) * GRID_SIZE + x] : null,
          x > 0 ? grid[y * GRID_SIZE + (x - 1)] : null,
          x < 3 ? grid[y * GRID_SIZE + (x + 1)] : null,
        ];
        if (neighbors.some((n) => n === current)) return true;
      }
    }
    return false;
  };

  return (
    <div className="game-2048-container">
      <div className="game-header">
        <Link to="/" className="back-button">← Geri Dön</Link>
        <h1>🎯 2048</h1>
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

      <div 
        className="game-board"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid-container">
          {grid.map((val, i) => (
            <div
              key={i}
              className={`cell ${val ? `value-${val}` : ''}`}
            >
              {val || ''}
            </div>
          ))}
        </div>
      </div>

      <div className="game-controls">
        <button className="control-btn new-game" onClick={initializeGame}>
          🔄 Yeni Oyun
        </button>
        <div className="swipe-hint">
          <p>Klavye okları veya kaydırma ile oyna!</p>
        </div>
      </div>

      {gameWon && !gameOver && (
        <div className="victory-overlay">
          <div className="victory-card">
            <h2>🎉 Tebrikler!</h2>
            <p>2048'e ulaştın!</p>
            <div className="victory-actions">
              <button onClick={() => setGameWon(false)} className="continue-btn">
                Devam Et
              </button>
              <button onClick={initializeGame} className="restart-btn">
                Yeni Oyun
              </button>
            </div>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-card">
            <h2>😔 Oyun Bitti!</h2>
            <div className="final-score">
              <span>Final Skor: {score}</span>
              {score === bestScore && <span className="new-record">🏆 Yeni Rekor!</span>}
            </div>
            <div className="game-over-actions">
              <button onClick={initializeGame} className="restart-btn">
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
              <h2>🎯 Nasıl Oynanır?</h2>
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
                  <p>Aynı sayıları birleştirerek 2048 sayısına ulaş!</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-icon">⌨️</div>
                <div className="instruction-text">
                  <h3>Kontroller</h3>
                  <p>Ok tuşları ile yön belirle. Mobilde kaydırma kullan.</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-icon">🔢</div>
                <div className="instruction-text">
                  <h3>Oyun Kuralı</h3>
                  <p>Aynı sayılar çarptığında birleşir ve iki katı olur.</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-icon">🏆</div>
                <div className="instruction-text">
                  <h3>Kazanma</h3>
                  <p>2048 karesi oluşturduğunda kazanırsın! Sonra devam edebilirsin.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game2048;
