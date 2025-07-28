import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // ✅ Ana sayfa linki için eklendi
import './memory-game.css';

import logo from '../assets/cards/5 yıldız logo.png';
import aslan from '../assets/cards/aslan.png';
import ciro from '../assets/cards/ciro.png';
import forma from '../assets/cards/forma.png';
import icardi from '../assets/cards/icardi.png';
import mertens from '../assets/cards/mertens.png';
import muslera from '../assets/cards/muslera.png';
import osimhenMaske from '../assets/cards/osimhen maske.png';
import osimhen from '../assets/cards/osimhen.png';

const cardImages = [
  logo,
  aslan,
  ciro,
  forma,
  icardi,
  mertens,
  muslera,
  osimhenMaske,
  osimhen
];

// Rastgele karıştırılmış kart çiftleri oluşturur
function shuffleArray(images) {
  const doubleImages = [...images, ...images];
  return doubleImages
    .map((img, index) => ({
      id: index,
      img,
      isFlipped: false,
      isMatched: false
    }))
    .sort(() => Math.random() - 0.5);
}

function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [lockBoard, setLockBoard] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [gameTime, setGameTime] = useState(0);

  useEffect(() => {
    setCards(shuffleArray(cardImages));
  }, []);

  // Zamanlayıcı
  useEffect(() => {
    let interval = null;
    if (gameStarted && matchedPairs < cardImages.length) {
      interval = setInterval(() => {
        setGameTime(Date.now() - startTime);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameStarted, matchedPairs, startTime]);

  const formatTime = (time) => {
    const seconds = Math.floor(time / 1000) % 60;
    const minutes = Math.floor(time / 60000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCardClick = (index) => {
    if (lockBoard || cards[index].isFlipped || cards[index].isMatched) return;

    // Oyunu başlat
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    if (!firstCard) {
      setFirstCard({ ...newCards[index], index });
    } else if (!secondCard) {
      setSecondCard({ ...newCards[index], index });
      setLockBoard(true);
      setMoves(moves + 1);
    }
  };

  useEffect(() => {
    if (firstCard && secondCard) {
      const match = firstCard.img === secondCard.img;
      setTimeout(() => {
        const newCards = [...cards];
        if (match) {
          newCards[firstCard.index].isMatched = true;
          newCards[secondCard.index].isMatched = true;
          setMatchedPairs(matchedPairs + 1);
        } else {
          newCards[firstCard.index].isFlipped = false;
          newCards[secondCard.index].isFlipped = false;
        }
        setCards(newCards);
        setFirstCard(null);
        setSecondCard(null);
        setLockBoard(false);
      }, 1000);
    }
  }, [secondCard, matchedPairs]);

  const restartGame = () => {
    setCards(shuffleArray(cardImages));
    setFirstCard(null);
    setSecondCard(null);
    setLockBoard(false);
    setMoves(0);
    setMatchedPairs(0);
    setGameStarted(false);
    setStartTime(null);
    setGameTime(0);
  };

  const isGameWon = matchedPairs === cardImages.length;

  return (
    <div className="memory-container">
      <div className="memory-header">
        <Link to="/" className="back-button">← Ana Sayfa</Link>
        <h1>Kart Eşleme Oyunu</h1>
      </div>

      <div className="memory-game">
        <div className="game-info">
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Hamle:</span>
              <span className="stat-value">{moves}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Eşleşen:</span>
              <span className="stat-value">{matchedPairs} / {cardImages.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Süre:</span>
              <span className="stat-value">{formatTime(gameTime)}</span>
            </div>
          </div>
        </div>

        <div className="game-area">
          {isGameWon && (
            <div className="game-result win">
              <p>🎉 Tebrikler! Oyunu {moves} hamlede {formatTime(gameTime)} sürede tamamladınız!</p>
            </div>
          )}

          <div className="memory-grid">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="card-front"></div>
                <div className="card-back">
                  <img src={card.img} alt="card" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="game-controls">
          <button className="memory-button restart-button" onClick={restartGame}>
            {isGameWon ? 'Yeni Oyun' : 'Yeniden Başlat'}
          </button>
        </div>

        <div className="game-instructions">
          <h3>Nasıl Oynanır?</h3>
          <ul>
            <li>Kartlara tıklayarak çevirin ve eşleşen çiftleri bulun</li>
            <li>Aynı anda sadece 2 kart çevrilebilir</li>
            <li>Eşleşen kartlar açık kalır, eşleşmeyenler kapanır</li>
            <li>Tüm çiftleri en az hamlede bulmaya çalışın</li>
            <li>Zamanınız ölçülür, hızlı olmaya çalışın!</li>
            <li>Galatasaray temalı kartlarla hafıza gücünüzü test edin</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MemoryGame;
