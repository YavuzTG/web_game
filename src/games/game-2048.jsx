import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './game-2048.css';

const GRID_SIZE = 4;

const Game2048 = () => {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem('bestScore')) || 0
  );
  const [gameOver, setGameOver] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameOver) return;
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
  }, [grid, gameOver]);

  const initializeGame = () => {
    const emptyGrid = Array(GRID_SIZE * GRID_SIZE).fill('');
    addNewNumber(emptyGrid);
    addNewNumber(emptyGrid);
    setGrid(emptyGrid);
    setScore(0);
    setGameOver(false);
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
    if (gameOver) return;

    const newGrid = [...grid];
    const size = GRID_SIZE;
    let moved = false;
    let newScore = score;

    const getIndex = (x, y) => y * size + x;

    const traverse = (callback) => {
      const range = [...Array(size).keys()];
      const ordered = direction === 'right' || direction === 'down' ? [...range].reverse() : range;
      ordered.forEach((y) => {
        ordered.forEach((x) => {
          callback(x, y);
        });
      });
    };

    const dx = { left: -1, right: 1, up: 0, down: 0 };
    const dy = { left: 0, right: 0, up: -1, down: 1 };

    traverse((x, y) => {
      let currentX = x;
      let currentY = y;
      let index = getIndex(currentX, currentY);
      let value = newGrid[index];
      if (value === '') return;

      let nextX = currentX + dx[direction];
      let nextY = currentY + dy[direction];

      while (
        nextX >= 0 &&
        nextX < size &&
        nextY >= 0 &&
        nextY < size
      ) {
        let nextIndex = getIndex(nextX, nextY);
        if (newGrid[nextIndex] === '') {
          newGrid[nextIndex] = value;
          newGrid[getIndex(currentX, currentY)] = '';
          currentX = nextX;
          currentY = nextY;
          index = nextIndex;
          nextX += dx[direction];
          nextY += dy[direction];
          moved = true;
        } else if (newGrid[nextIndex] === value) {
          newGrid[nextIndex] = value * 2;
          newGrid[getIndex(currentX, currentY)] = '';
          newScore += value * 2;
          moved = true;
          break;
        } else {
          break;
        }
      }
    });

    if (moved) {
      const added = addNewNumber(newGrid);
      setGrid(added);
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('bestScore', newScore.toString());

        // En yüksek skoru kaydet (isim istemeden)
        let bestScores = JSON.parse(localStorage.getItem('bestScores')) || [];
        bestScores.push({ score: newScore });
        bestScores = bestScores.sort((a, b) => b.score - a.score).slice(0, 10);
        localStorage.setItem('bestScores', JSON.stringify(bestScores));
      }
      if (!canMove(added)) setGameOver(true);
    }
  }, [grid, gameOver, score, bestScore]);

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
    <div className="game-container">
      <h1>2048</h1>
      <div className="score-panel">
        <div>Score: {score}</div>
        <div>Best: {bestScore}</div>
      </div>

      <div className="grid-container">
        {grid.map((val, i) => (
          <div
            key={i}
            className={`cell ${val ? `value-${val}` : ''}`}
          >
            {val}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="game-over">
          <h2>Game Over</h2>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
            <button onClick={initializeGame}>Restart Game</button>
            <button onClick={() => navigate('/')}>Ana Sayfa</button>
          </div>
        </div>
      )}

      {!gameOver && (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
          <button onClick={initializeGame}>Restart Game</button>
          <button onClick={() => navigate('/')}>Ana Sayfa</button>
        </div>
      )}
    </div>
  );
};

export default Game2048;
