import React, { useState, useEffect } from 'react';
import './fruit-ninja.css';

import apple from '../assets/fruit-ninja/apple.png';
import banana from '../assets/fruit-ninja/banana.png';
import watermelon from '../assets/fruit-ninja/watermelon.png';
import bomb from '../assets/fruit-ninja/bomb.png';

const meyveler = [
  { ad: 'apple', src: apple },
  { ad: 'banana', src: banana },
  { ad: 'watermelon', src: watermelon },
  { ad: 'bomb', src: bomb, isBomb: true }
];

function FruitNinja() {
  const [objeler, setObjeler] = useState([]);
  const [puan, setPuan] = useState(0);
  const [oyunBitti, setOyunBitti] = useState(false);

  useEffect(() => {
    if (oyunBitti) return;

    const interval = setInterval(() => {
      const rastgele = meyveler[Math.floor(Math.random() * meyveler.length)];
      const yeni = {
        ...rastgele,
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: 100,
        rotate: Math.random() * 360,
        speedX: (Math.random() - 0.5) * 4,
        speedY: -Math.random() * 4 - 6
      };
      setObjeler(prev => [...prev, yeni]);
    }, 1000);

    return () => clearInterval(interval);
  }, [oyunBitti]);

  useEffect(() => {
    if (oyunBitti) return;

    const animasyon = setInterval(() => {
      setObjeler(prev =>
        prev
          .map(o => ({
            ...o,
            x: o.x + o.speedX,
            y: o.y + o.speedY,
            speedY: o.speedY + 0.4
          }))
          .filter(o => o.y < window.innerHeight + 100)
      );
    }, 50);

    return () => clearInterval(animasyon);
  }, [oyunBitti]);

  const kir = (id, isBomb) => {
    if (isBomb) {
      setOyunBitti(true);
    } else {
      setPuan(p => p + 1);
      setObjeler(prev => prev.filter(o => o.id !== id));
    }
  };

  const yenidenBaslat = () => {
    setObjeler([]);
    setPuan(0);
    setOyunBitti(false);
  };

  // Fare veya parmak üstüne gelince kes
  const handleHover = (obj) => {
    kir(obj.id, obj.isBomb);
  };

  return (
    <div className="fruit-ninja-container">
      <h2>Fruit Ninja</h2>
      <p>Puan: {puan}</p>
      {oyunBitti && (
        <div className="bitis-ekrani">
          <h3>💣 Oyunu Kaybettin!</h3>
          <button onClick={yenidenBaslat}>Yeniden Başla</button>
        </div>
      )}

      <div className="oyun-alani">
        {objeler.map(obj => (
          <img
            key={obj.id}
            src={obj.src}
            alt={obj.ad}
            className="meyve"
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}px`,
              transform: `rotate(${obj.rotate}deg)`
            }}
            onMouseEnter={() => handleHover(obj)}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              const rect = e.target.getBoundingClientRect();
              const withinX = touch.clientX >= rect.left && touch.clientX <= rect.right;
              const withinY = touch.clientY >= rect.top && touch.clientY <= rect.bottom;
              if (withinX && withinY) handleHover(obj);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default FruitNinja;
