import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    setCards(shuffleArray(cardImages));
  }, []);

  const handleCardClick = (index) => {
    if (lockBoard || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    if (!firstCard) {
      setFirstCard({ ...newCards[index], index });
    } else if (!secondCard) {
      setSecondCard({ ...newCards[index], index });
      setLockBoard(true);
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
  }, [secondCard]);

  const restartGame = () => {
    setCards(shuffleArray(cardImages));
    setFirstCard(null);
    setSecondCard(null);
    setLockBoard(false);
  };

  return (
    <div className="memory-container">
      <h1>Kart Eşleme Oyunu</h1>
      <div className="memory-grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="front"></div>
            <div className="back">
              <img src={card.img} alt="card" />
            </div>
          </div>
        ))}
      </div>
      <button className="memory-button" onClick={restartGame}>Yeniden Başlat</button>
    </div>
  );
}

export default MemoryGame;
