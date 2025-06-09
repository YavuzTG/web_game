import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './tic-tac-toe.css';

function Tic_tac_toe() {
  const [gameMode, setGameMode] = useState(null); // 'single' | 'multi'
  const [playerSymbol, setPlayerSymbol] = useState(null); // 'X' | 'O'
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winningLine, setWinningLine] = useState([]); // Kazanan satır için

  const botSymbol = playerSymbol === 'X' ? 'O' : 'X';

  // Kazanan ve kazanan satırı bulup set ediyoruz
  useEffect(() => {
    const result = calculateWinnerWithLine(squares);
    if (result) {
      setWinningLine(result.line);
    } else {
      setWinningLine([]);
    }
  }, [squares]);

  const handleClick = (i) => {
    if (calculateWinnerWithLine(squares) || squares[i]) return;

    if (gameMode === 'single' && !isPlayerTurn()) return; // Botun sırası değilse engelle

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const restartGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinningLine([]);
  };

  const renderSquare = (i) => {
    const isWinningSquare = winningLine.includes(i);
    return (
      <button
        key={i}
        className={`square ${isWinningSquare ? 'winning-square' : ''}`}
        onClick={() => handleClick(i)}
        disabled={!!calculateWinnerWithLine(squares)}
      >
        {squares[i]}
      </button>
    );
  };

  const winnerData = calculateWinnerWithLine(squares);
  const winner = winnerData ? winnerData.winner : null;
  const isDraw = !winner && squares.every(Boolean);
  const status = winner
    ? `Kazanan: ${winner}`
    : isDraw
    ? 'Berabere'
    : `Sıradaki: ${xIsNext ? 'X' : 'O'}`;

  const handleSymbolSelect = (symbol) => {
    setPlayerSymbol(symbol);
    restartGame();
  };

  // Botun sırası mı?
  function isPlayerTurn() {
    return (playerSymbol === 'X' && xIsNext) || (playerSymbol === 'O' && !xIsNext);
  }

  // Bot hamlesi (Minimax algoritması)
  useEffect(() => {
    if (gameMode === 'single' && playerSymbol && !isPlayerTurn() && !winner && !isDraw) {
      const timeout = setTimeout(() => {
        const bestMove = findBestMove(squares, botSymbol, playerSymbol);
        if (bestMove !== -1) {
          const nextSquares = squares.slice();
          nextSquares[bestMove] = botSymbol;
          setSquares(nextSquares);
          setXIsNext(!xIsNext);  // Burada düzeltildi: sırayı tersine çevir
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [squares, xIsNext, gameMode, playerSymbol, botSymbol, winner, isDraw]);

  if (!gameMode) {
    return (
      <div className="tic-tac-toe-container">
        <h1>Oyun Modu Seç</h1>
        <button className="tic-tac-toe-button" onClick={() => setGameMode('single')}>
          Tek Oyunculu
        </button>
        <button className="tic-tac-toe-button" onClick={() => setGameMode('multi')}>
          2 Oyunculu
        </button>
        <br /><br />
        <Link to="/" className="back-link">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  if (gameMode === 'single' && playerSymbol === null) {
    return (
      <div className="tic-tac-toe-container">
        <h1>Sembol Seç</h1>
        <button className="tic-tac-toe-button" onClick={() => handleSymbolSelect('X')}>
          X olmak istiyorum
        </button>
        <button className="tic-tac-toe-button" onClick={() => handleSymbolSelect('O')}>
          O olmak istiyorum
        </button>
        <br /><br />
        <button className="tic-tac-toe-button" onClick={() => setGameMode(null)}>
          Geri
        </button>
        <br /><br />
        <Link to="/" className="back-link">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  return (
    <div className="tic-tac-toe-container">
      <h1>Tic Tac Toe</h1>
      <p>{status}</p>

      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>

      <button className="tic-tac-toe-button" onClick={restartGame}>
        Yeniden Başlat
      </button>

      <br /><br />
      <button
        className="tic-tac-toe-button"
        onClick={() => {
          setGameMode(null);
          setPlayerSymbol(null);
          restartGame();
        }}
      >
        Geri
      </button>

      <br /><br />
      <Link to="/" className="back-link">Ana Sayfaya Dön</Link>
    </div>
  );
}

// Kazanan ve kazanan satırı döndüren fonksiyon
function calculateWinnerWithLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

// Minimax algoritması

function findBestMove(board, bot, player) {
  let bestVal = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = bot;
      let moveVal = minimax(board, 0, false, bot, player);
      board[i] = null;

      if (moveVal > bestVal) {
        bestVal = moveVal;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

function minimax(board, depth, isMax, bot, player) {
  const winnerObj = calculateWinnerWithLine(board);
  if (winnerObj) {
    if (winnerObj.winner === bot) return 10 - depth;
    else if (winnerObj.winner === player) return depth - 10;
  }
  if (board.every(Boolean)) return 0; // Berabere

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = bot;
        best = Math.max(best, minimax(board, depth + 1, false, bot, player));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = player;
        best = Math.min(best, minimax(board, depth + 1, true, bot, player));
        board[i] = null;
      }
    }
    return best;
  }
}

export default Tic_tac_toe;
