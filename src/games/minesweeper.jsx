import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './minesweeper.css';

const generateGrid = (size, mineCount) => {
  let grid = Array(size * size).fill().map((_, idx) => ({
    id: idx,
    isMine: false,
    revealed: false,
    flagged: false,
    adjacentMines: 0
  }));

  const minePositions = new Set();
  while (minePositions.size < mineCount) {
    minePositions.add(Math.floor(Math.random() * size * size));
  }

  minePositions.forEach(pos => grid[pos].isMine = true);

  const directions = [-1, 1, -size, size, -size - 1, -size + 1, size - 1, size + 1];
  grid.forEach((cell, idx) => {
    if (cell.isMine) return;
    let count = 0;
    directions.forEach(dir => {
      const neighborIdx = idx + dir;
      const isSameRow = Math.floor(idx / size) === Math.floor(neighborIdx / size);
      if (
        neighborIdx >= 0 && neighborIdx < size * size &&
        !(dir === -1 && !isSameRow) &&
        !(dir === 1 && !isSameRow)
      ) {
        if (grid[neighborIdx]?.isMine) count++;
      }
    });
    cell.adjacentMines = count;
  });

  return grid;
};

export default function Minesweeper({ size = 8, mines = 10 }) {
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const restartGame = () => {
    setGrid(generateGrid(size, mines));
    setGameOver(false);
  };

  useEffect(() => {
    restartGame();
  }, []);

  useEffect(() => {
    restartGame();
  }, []);

  const getNeighbors = (id) => {
    const dirs = [-1, 1, -size, size, -size - 1, -size + 1, size - 1, size + 1];
    const neighbors = [];

    dirs.forEach(dir => {
      const neighborId = id + dir;
      const sameRow = Math.floor(id / size) === Math.floor(neighborId / size);

      if (
        neighborId >= 0 &&
        neighborId < size * size &&
        !(dir === -1 && !sameRow) &&
        !(dir === 1 && !sameRow)
      ) {
        neighbors.push(neighborId);
      }
    });

    return neighbors;
  };

  const floodReveal = (startId, grid) => {
    const stack = [startId];
    const visited = new Set();

    while (stack.length > 0) {
      const currentId = stack.pop();
      const currentCell = grid[currentId];

      if (!currentCell || currentCell.revealed || visited.has(currentId)) continue;

      currentCell.revealed = true;
      visited.add(currentId);

      if (currentCell.adjacentMines === 0) {
        const neighbors = getNeighbors(currentId);
        neighbors.forEach(nid => {
          if (!grid[nid].revealed && !grid[nid].isMine) {
            stack.push(nid);
          }
        });
      }
    }
  };

  const reveal = (id) => {
    if (gameOver || grid[id].revealed || grid[id].flagged) return;

    const newGrid = [...grid];

    if (newGrid[id].isMine) {
      // 💥 Tüm mayınları göster
      newGrid.forEach(cell => {
        if (cell.isMine) cell.revealed = true;
      });
      setGrid(newGrid);
      setGameOver(true);
      alert('💣 Game Over!');
      return;
    }

    floodReveal(id, newGrid);

    // Kazanma kontrolü
    const totalCells = size * size;
    const revealedSafeCells = newGrid.filter(cell => cell.revealed && !cell.isMine).length;
    const totalSafeCells = totalCells - mines;

    if (revealedSafeCells === totalSafeCells) {
      setGameOver(true);
      alert('🎉 Tebrikler! Oyunu kazandınız!');
    }

    setGrid(newGrid);
  };

  const toggleFlag = (id, e) => {
    e.preventDefault();
    if (gameOver) return;

    const newGrid = [...grid];
    const cell = newGrid[id];
    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    setGrid(newGrid);
  };

  return (
    <div className="minesweeper-container">
      <div className="game-header">
        <Link to="/" className="back-button">← Geri Dön</Link>
        <h1>💣 Minesweeper</h1>
        <button 
          className="help-button"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          ❓
        </button>
      </div>

      <div className="minesweeper" style={{ gridTemplateColumns: `repeat(${size}, 50px)` }}>
        {grid.map(cell => (
          <div
            key={cell.id}
            className={`cell ${cell.revealed ? 'revealed' : ''} ${cell.isMine && cell.revealed ? 'mine' : ''} ${cell.flagged ? 'flagged' : ''}`}
            data-count={cell.revealed && !cell.isMine && cell.adjacentMines > 0 ? cell.adjacentMines : ''}
            onClick={() => reveal(cell.id)}
            onContextMenu={(e) => toggleFlag(cell.id, e)}
          >
            {cell.revealed && !cell.isMine && cell.adjacentMines > 0 && cell.adjacentMines}
            {cell.revealed && cell.isMine && '💣'}
            {!cell.revealed && cell.flagged && '🚩'}
          </div>
        ))}
      </div>

      <div className="game-controls">
        <div className="control-hint">
          <p>🖱️ Sol tık: Aç | Sağ tık: Bayrak | 💣 Mayınları kaçın!</p>
        </div>
        <button className="restart-btn" onClick={restartGame}>
          🔄 Yeniden Başlat
        </button>
      </div>

      {showInstructions && (
        <div className="instructions-overlay" onClick={() => setShowInstructions(false)}>
          <div className="instructions-card" onClick={(e) => e.stopPropagation()}>
            <div className="instructions-header">
              <h2>Nasıl Oynanır?</h2>
              <button className="close-btn" onClick={() => setShowInstructions(false)}>×</button>
            </div>
            <div className="instructions-content">
              <div className="instruction-item">
                <div className="instruction-icon">🖱️</div>
                <div className="instruction-text">
                  <h3>Temel Kontroller</h3>
                  <p>Sol tık ile kareleri açın, sağ tık ile bayrak koyun.</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-icon">💣</div>
                <div className="instruction-text">
                  <h3>Amaç</h3>
                  <p>Tüm mayınları bulmadan tüm güvenli kareleri açın.</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-icon">🔢</div>
                <div className="instruction-text">
                  <h3>Sayılar</h3>
                  <p>Her sayı, o karenin etrafındaki mayın sayısını gösterir.</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-icon">🚩</div>
                <div className="instruction-text">
                  <h3>Bayraklar</h3>
                  <p>Mayın olduğunu düşündüğünüz karelere bayrak koyun.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
