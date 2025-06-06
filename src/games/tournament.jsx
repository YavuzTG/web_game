import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Hayvan resimleri
const animalsData = Array.from({ length: 64 }, (_, i) => ({
  id: i + 1,
  name: `Hayvan ${i + 1}`,
  image: `/assets/uwufufu/hayvan/hayvan${i + 1}.jpg`,
}));

// Meyve resimleri (placeholder)
const fruitsData = Array.from({ length: 64 }, (_, i) => ({
  id: i + 1,
  name: `Meyve ${i + 1}`,
  image: `https://placehold.co/150x150/png?text=Meyve+${i + 1}`,
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
  const navigate = useNavigate();

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
      <div className="winner-container" style={{ position: 'relative' }}>
        <button
          className="back-button"
          onClick={() => navigate('/tournament')}
          style={{ position: 'absolute', top: 20, right: 20 }}
        >
          Geri Gel
        </button>
        <h1>Kazanan: {winner.name}</h1>
        <img src={winner.image} alt={winner.name} className="winner-image" />
      </div>
    );
  }

  const firstAnimal = currentRoundAnimals[currentMatchIndex * 2];
  const secondAnimal = currentRoundAnimals[currentMatchIndex * 2 + 1];

  return (
    <div className="tournament-container" style={{ position: 'relative' }}>
      <button
        className="back-button"
        onClick={() => navigate('/tournament')}
        style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}
      >
        Geri Gel
      </button>

      <h2>
        Tur {round} / Maç: {currentMatchIndex + 1} / {currentRoundAnimals.length / 2}
      </h2>

      <div className="match-container">
        <div
          className="animal-card left-card"
          onClick={() => handleSelect(firstAnimal)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSelect(firstAnimal); }}
        >
          <img src={firstAnimal.image} alt={firstAnimal.name} className="animal-image" />
          <h3>{firstAnimal.name}</h3>
        </div>

        <div
          className="animal-card right-card"
          onClick={() => handleSelect(secondAnimal)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSelect(secondAnimal); }}
        >
          <img src={secondAnimal.image} alt={secondAnimal.name} className="animal-image" />
          <h3>{secondAnimal.name}</h3>
        </div>
      </div>
    </div>
  );
}
