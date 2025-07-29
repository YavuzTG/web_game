import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './color-mixer.css';

const getRandomColor = () => ({
  r: Math.floor(Math.random() * 256),
  g: Math.floor(Math.random() * 256),
  b: Math.floor(Math.random() * 256),
});

const getColorString = ({ r, g, b }) => `rgb(${r}, ${g}, ${b})`;

const colorDifference = (c1, c2) => {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
};

export default function ColorMix() {
  const [targetColor, setTargetColor] = useState(getRandomColor());
  const [playerColor, setPlayerColor] = useState({ r: 0, g: 0, b: 0 });
  const [difference, setDifference] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayerColor(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleMix = () => {
    const diff = colorDifference(targetColor, playerColor);
    setDifference(diff);
  };

  const handleNewColor = () => {
    setTargetColor(getRandomColor());
    setPlayerColor({ r: 0, g: 0, b: 0 });
    setDifference(null);
  };

  return (
    <div className="color-mixer-container">
      <div className="game-header">
        <Link to="/" className="back-button">← Geri Dön</Link>
        <h1 style={{ marginLeft: '-50px' }}>🎨 Renk Karıştırma</h1>
      </div>

      <div className="color-boxes">
        <div>
          <p>🎯 Hedef Renk</p>
          <div
            className="color-box"
            style={{ backgroundColor: getColorString(targetColor) }}
          />
        </div>
        <div>
          <p>🧪 Senin Rengin</p>
          <div
            className="color-box"
            style={{ backgroundColor: getColorString(playerColor) }}
          />
        </div>
      </div>

      <div className="sliders">
        <label>🔴 Kırmızı: <input type="range" name="r" min="0" max="255" value={playerColor.r} onChange={handleChange} /></label>
        <label>🟢 Yeşil: <input type="range" name="g" min="0" max="255" value={playerColor.g} onChange={handleChange} /></label>
        <label>🔵 Mavi: <input type="range" name="b" min="0" max="255" value={playerColor.b} onChange={handleChange} /></label>
      </div>

      <div className="game-controls" style={{ marginLeft: '570px' }}>
        <button onClick={handleMix} className="restart-btn">🎛 Karıştır</button>
        <button onClick={handleNewColor} className="restart-btn">🔄 Yeni Hedef</button>
      </div>

      {difference !== null && (
        <p className="result">
          � Fark: <strong>{Math.round(difference)}</strong> / 441 <br />
          (0 = mükemmel eşleşme)
        </p>
      )}
    </div>
  );
}
