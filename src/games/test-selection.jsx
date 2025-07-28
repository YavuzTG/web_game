import React from 'react';
import { Link } from 'react-router-dom';
import './uwufufu.css';

const testOptions = [
  {
    id: 'animals',
    title: 'Hayvan Turnuvası',
    description: '64 farklı hayvan arasından favorini seç ve şampiyonu belirle!',
    image: '/assets/uwufufu/hayvan/hayvan1.jpg',
    count: '64 Yarışmacı',
    emoji: '🐾'
  },
  {
    id: 'fruits',
    title: 'Meyve Turnuvası',
    description: '32 lezzetli meyve arasında favorini seç!',
    image: '/assets/uwufufu/meyve/meyve1.png',
    count: '32 Yarışmacı',
    emoji: '🍎'
  },
  {
    id: 'colors',
    title: 'Renk Turnuvası',
    description: '64 güzel renk arasından en sevdiğini seç!',
    image: '/assets/uwufufu/color/color1.png',
    count: '64 Yarışmacı',
    emoji: '🎨'
  },
];

export default function TestSelection() {
  return (
    <div className="test-selection-container">
      <div className="tournament-header">
        <Link to="/" className="back-button">← Ana Sayfa</Link>
        <h1>🏆 UwuFufu Turnuvaları</h1>
        <div></div>
      </div>

      <div className="selection-header">
        <p>Hangi kategoride şampiyon olmak istiyorsun? Favori seçimini yap ve turnuvayı kazan!</p>
      </div>

      <div className="test-options">
        {testOptions.map(option => (
          <Link
            key={option.id}
            to={`/tournament/${option.id}`}
            className="test-option"
          >
            <img src={option.image} alt={option.title} className="test-image" />
            <div className="test-text">
              <h3>{option.emoji} {option.title}</h3>
              <p>{option.description}</p>
              <div className="test-count">{option.count}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="instructions-section">
        <h2>🎯 Nasıl Oynanır?</h2>
        <div className="instructions-grid">
          <div className="instruction-card">
            <div className="instruction-icon">1️⃣</div>
            <h3>Kategori Seç</h3>
            <p>Hayvan, meyve veya renk kategorilerinden birini seç</p>
          </div>
          <div className="instruction-card">
            <div className="instruction-icon">2️⃣</div>
            <h3>Seçim Yap</h3>
            <p>Her turda karşına çıkan iki seçenek arasından favorini seç</p>
          </div>
          <div className="instruction-card">
            <div className="instruction-icon">3️⃣</div>
            <h3>Şampiyon Ol</h3>
            <p>Tüm turları geçerek şampiyon seçimini belirle!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
