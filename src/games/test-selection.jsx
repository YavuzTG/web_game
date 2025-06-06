import React from 'react';
import { useNavigate } from 'react-router-dom';
import './uwufufu.css';

const testOptions = [
  {
    id: 'animals',
    title: 'Hayvan Turnuvası',
    description: '64 farklı hayvan arasından favorini seç!',
    image: '/assets/uwufufu/animals.png',  // public/assets/uwufufu/animals.png
  },
  {
    id: 'fruits',
    title: 'Meyve Turnuvası',
    description: 'En sevdiğin meyveyi seç!',
    image: '/assets/uwufufu/fruits.png',   // public/assets/uwufufu/fruits.png
  },
  {
    id: 'colors',
    title: 'Renk Turnuvası',
    description: 'En güzel rengi seç!',
    image: '/assets/uwufufu/colors.png',   // public/assets/uwufufu/colors.png
  },
];

export default function TestSelection() {
  const navigate = useNavigate();

  function handleSelect(testId) {
    navigate(`/tournament/${testId}`);
  }

  return (
    <div className="test-selection-container" style={{ position: 'relative' }}>
      <button
        className="home-button"
        onClick={() => navigate('/')}  // Anasayfa rotası
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10,
          padding: '8px 16px',
          cursor: 'pointer',
        }}
      >
        Anasayfa'ya Dön
      </button>

      <h2>Hangi Turnuvayı Oynamak İstersin?</h2>
      <div className="test-options">
        {testOptions.map(option => (
          <div
            key={option.id}
            className="test-option-card"
            onClick={() => handleSelect(option.id)}
          >
            <img src={option.image} alt={option.title} className="test-option-image" />
            <h3>{option.title}</h3>
            <p>{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
