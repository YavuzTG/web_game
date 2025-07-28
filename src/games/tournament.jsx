import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './uwufufu.css';

// Hayvan resimleri
const animalsData = Array.from({ length: 64 }, (_, i) => ({
  id: i + 1,
  name: `Hayvan ${i + 1}`,
  image: `/assets/uwufufu/hayvan/hayvan${i + 1}.jpg`,
}));

// Meyve resimleri (placeholder)
const fruitsData = Array.from({ length: 32 }, (_, i) => ({
  id: i + 1,
  name: `Meyve ${i + 1}`,
  image: `/assets/uwufufu/meyve/meyveler${i + 1}.png`,
}));

// Renk resimleri (hex)
const colorsData = Array.from({ length: 64 }, (_, i) => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  return {
    id: i + 1,
    name: `Renk ${i + 1}`,
    image: `https://via.placeholder.com/150/${randomColor}/ffffff?text=Renk+${i + 1}`,
  };
});

// Listeyi karıştıran yardımcı fonksiyon
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Tournament() {
  const { testId } = useParams();

  const getInitialData = () => {
    switch (testId) {
      case 'fruits':
        return fruitsData;
      case 'colors':
        return colorsData;
      case 'animals':
      default:
        return animalsData;
    }
  };

  const [currentRoundAnimals, setCurrentRoundAnimals] = useState(() => shuffle(getInitialData()));
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [selectedAnimalsNextRound, setSelectedAnimalsNextRound] = useState([]);
  const [round, setRound] = useState(1);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const initialData = shuffle(getInitialData());
    setCurrentRoundAnimals(initialData);
    setCurrentMatchIndex(0);
    setSelectedAnimalsNextRound([]);
    setRound(1);
    setWinner(null);
  }, [testId]);

  function handleSelect(animal) {
    const updatedSelected = [...selectedAnimalsNextRound, animal];
    const isLastMatch = currentMatchIndex >= currentRoundAnimals.length / 2 - 1;

    if (isLastMatch) {
      if (updatedSelected.length === 1) {
        setWinner(updatedSelected[0]);
      } else {
        setCurrentRoundAnimals(shuffle(updatedSelected));
        setSelectedAnimalsNextRound([]);
        setCurrentMatchIndex(0);
        setRound(prev => prev + 1);
      }
    } else {
      setSelectedAnimalsNextRound(updatedSelected);
      setCurrentMatchIndex(prev => prev + 1);
    }
  }

  if (winner) {
    return (
      <div className="tournament-container">
        <div className="tournament-header">
          <Link to="/tournament" className="back-button">← Geri Dön</Link>
          <h1>🏆 Turnuva Tamamlandı!</h1>
          <div></div>
        </div>
        
        <div className="winner-container">
          <div className="winner-card">
            <div className="winner-crown">👑</div>
            <img src={winner.image} alt={winner.name} className="winner-image" />
            <h2 className="winner-name">{winner.name}</h2>
            <div className="winner-title">ŞAMPIYON</div>
            <div className="celebration">🎉 🎊 🎉</div>
          </div>
        </div>

        <div className="victory-actions">
          <Link to="/tournament" className="play-again-button">
            🔄 Tekrar Oyna
          </Link>
          <Link to="/" className="home-button">
            🏠 Ana Sayfa
          </Link>
        </div>
      </div>
    );
  }

  const firstAnimal = currentRoundAnimals[currentMatchIndex * 2];
  const secondAnimal = currentRoundAnimals[currentMatchIndex * 2 + 1];

  const getTournamentTitle = () => {
    switch (testId) {
      case 'fruits': return '🍎 Meyve Turnuvası';
      case 'colors': return '🎨 Renk Turnuvası';
      case 'animals':
      default: return '🐾 Hayvan Turnuvası';
    }
  };

  return (
    <div className="tournament-container">
      <div className="tournament-header">
        <Link to="/tournament" className="back-button">← Geri Dön</Link>
        <h1>{getTournamentTitle()}</h1>
        <div></div>
      </div>

      <div className="tournament-info">
        <div className="round-info">
          <span className="round-badge">Tur {round}</span>
          <span className="match-info">Maç {currentMatchIndex + 1} / {Math.floor(currentRoundAnimals.length / 2)}</span>
        </div>
        <div className="vs-indicator">VS</div>
      </div>

      <div className="match-container">
        <div
          className="contestant-card left-card"
          onClick={() => handleSelect(firstAnimal)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSelect(firstAnimal); }}
        >
          <div className="card-inner">
            <img src={firstAnimal.image} alt={firstAnimal.name} className="contestant-image" />
            <h3>{firstAnimal.name}</h3>
            <div className="select-button">Seç 👈</div>
          </div>
        </div>

        <div
          className="contestant-card right-card"
          onClick={() => handleSelect(secondAnimal)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSelect(secondAnimal); }}
        >
          <div className="card-inner">
            <img src={secondAnimal.image} alt={secondAnimal.name} className="contestant-image" />
            <h3>{secondAnimal.name}</h3>
            <div className="select-button">Seç 👉</div>
          </div>
        </div>
      </div>

      <div className="tournament-progress">
        <div className="progress-text">
          Kalan: {currentRoundAnimals.length - (currentMatchIndex + 1) * 2 + selectedAnimalsNextRound.length} tur
        </div>
      </div>
    </div>
  );
}
