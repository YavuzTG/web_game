import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './tic-tac-toe.css';

function Tic_tac_toe() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i) => {
    if (calculateWinner(squares) || squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const restartGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const renderSquare = (i) => (
    <button className="square" onClick={() => handleClick(i)}>
      {squares[i]}
    </button>
  );

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean); // Beraberlik kontrolü

  const status = winner
    ? `Kazanan: ${winner}`
    : isDraw
      ? 'Berabere'
      : `Sıradaki: ${xIsNext ? 'X' : 'O'}`;

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
      <Link to="/" className="back-link">Ana Sayfaya Dön</Link>
    </div>
  );
}

// Kazananı kontrol eden yardımcı fonksiyon
function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Tic_tac_toe;
