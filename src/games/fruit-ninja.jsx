import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './fruit-ninja.css';

import apple from '../assets/fruit-ninja/apple.png';
import banana from '../assets/fruit-ninja/banana.png';
import watermelon from '../assets/fruit-ninja/watermelon.png';
import bomb from '../assets/fruit-ninja/bomb.png';

const FRUITS = [
  { name: 'apple', src: apple, points: 1, color: '#ff4757' },
  { name: 'banana', src: banana, points: 2, color: '#ffa502' },
  { name: 'watermelon', src: watermelon, points: 3, color: '#2ed573' },
];

const BOMB = { name: 'bomb', src: bomb, isBomb: true, color: '#2f3542' };

const FruitNinja = () => {
  const [fruits, setFruits] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [sliceTrail, setSliceTrail] = useState([]);
  const [combo, setCombo] = useState(0);
  const [lastSliceTime, setLastSliceTime] = useState(0);
  
  const gameAreaRef = useRef(null);
  const animationRef = useRef(null);
  const fruitIdRef = useRef(0);
  const isSlicing = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const lastLifeLostTime = useRef(0);

  // Meyve oluşturma
  const createFruit = useCallback(() => {
    if (gameOver || !gameStarted) return;

    const isBomb = Math.random() < 0.1; // %10 bomba şansı (azaltıldı)
    const fruit = isBomb ? BOMB : FRUITS[Math.floor(Math.random() * FRUITS.length)];
    
    const newFruit = {
      ...fruit,
      id: fruitIdRef.current++,
      x: Math.random() * (window.innerWidth - 100) + 50,
      y: window.innerHeight + 50,
      vx: (Math.random() - 0.5) * 6, // Yatay hız azaltıldı
      vy: -Math.random() * 8 - 12, // Dikey hız artırıldı (-12 ile -20 arası)
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 10,
      sliced: false,
      gravity: 0.3 // Yerçekimi azaltıldı
    };

    setFruits(prev => [...prev, newFruit]);
  }, [gameOver, gameStarted]);

  // Oyun başlatma
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setFruits([]);
    setCombo(0);
  };

  // Meyve animasyonu ve fizik
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const animate = () => {
      setFruits(prevFruits => {
        const newFruits = [];
        let lostLife = false;
        
        for (const fruit of prevFruits) {
          // Kesilmiş meyveler hemen kaldırılsın
          if (fruit.sliced) {
            continue;
          }
          
          // Meyve pozisyonunu güncelle
          const updatedFruit = {
            ...fruit,
            x: fruit.x + fruit.vx,
            y: fruit.y + fruit.vy,
            vy: fruit.vy + fruit.gravity,
            rotation: fruit.rotation + fruit.rotationSpeed
          };
          
          // Ekrandan çıkan meyveler - sadece bir kez can kaybı
          if (updatedFruit.y > window.innerHeight + 100) {
            if (!updatedFruit.isBomb && !lostLife) {
              const now = Date.now();
              // Son can kaybından en az 500ms geçmiş olmalı
              if (now - lastLifeLostTime.current > 500) {
                lostLife = true;
                lastLifeLostTime.current = now;
                setLives(prev => {
                  const newLives = prev - 1;
                  if (newLives <= 0) {
                    setGameOver(true);
                  }
                  return newLives;
                });
                setCombo(0);
              }
            }
            continue;
          }
          
          newFruits.push(updatedFruit);
        }
        
        return newFruits;
      });

      if (!gameOver) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver]);

  // Meyve oluşturma interval'i
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnFruit = () => {
      createFruit();
      const nextSpawn = Math.random() * 2000 + 1500; // 1.5-3.5 saniye arası (daha az sık)
      setTimeout(spawnFruit, nextSpawn);
    };

    const initialDelay = setTimeout(spawnFruit, 2000); // İlk meyve 2 saniye sonra
    return () => clearTimeout(initialDelay);
  }, [gameStarted, gameOver, createFruit]);

  // Mouse/Touch takibi
  const updateMousePosition = (e) => {
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (rect) {
      mousePos.current = {
        x: (e.clientX || e.touches?.[0]?.clientX) - rect.left,
        y: (e.clientY || e.touches?.[0]?.clientY) - rect.top
      };
    }
  };

  // Meyve kesme kontrolü
  const checkFruitSlice = (fruit) => {
    const distance = Math.sqrt(
      Math.pow(mousePos.current.x - fruit.x - 50, 2) + 
      Math.pow(mousePos.current.y - fruit.y - 50, 2)
    );
    
    return distance < 60; // Kesme mesafesi
  };

  // Mouse/Touch olayları
  const handleMouseDown = (e) => {
    e.preventDefault();
    isSlicing.current = true;
    updateMousePosition(e);
    
    // Trail başlat
    setSliceTrail([mousePos.current]);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    updateMousePosition(e);
    
    if (isSlicing.current) {
      // Trail güncelle
      setSliceTrail(prev => {
        const newTrail = [...prev, mousePos.current].slice(-10);
        return newTrail;
      });

      // Meyve kesme kontrolü
      setFruits(prevFruits => {
        let slicedCount = 0;
        const now = Date.now();
        
        const updatedFruits = prevFruits.map(fruit => {
          if (!fruit.sliced && checkFruitSlice(fruit)) {
            slicedCount++;
            
            if (fruit.isBomb) {
              setGameOver(true);
              // Bomba kesildiğinde hemen oyunu bitir
              return { ...fruit, sliced: true };
            } else {
              // Combo kontrolü
              if (now - lastSliceTime < 500) {
                setCombo(prev => prev + 1);
              } else {
                setCombo(1);
              }
              setLastSliceTime(now);
              
              const comboMultiplier = Math.min(combo + 1, 5);
              setScore(prev => prev + fruit.points * comboMultiplier);
              
              // Meyve kesildiğinde işaretle, animasyon bitince kaldırılacak
              setTimeout(() => {
                setFruits(prev => prev.filter(f => f.id !== fruit.id));
              }, 500);
              
              return { ...fruit, sliced: true };
            }
          }
          return fruit;
        });

        return updatedFruits;
      });
    }
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    isSlicing.current = false;
    
    // Trail temizle
    setTimeout(() => setSliceTrail([]), 200);
  };

  return (
    <div className="fruit-ninja-container">
      <div className="fruit-ninja-header">
        <Link to="/" className="back-button">← Ana Sayfa</Link>
        <h1>🥷 Fruit Ninja</h1>
        <div></div>
      </div>

      {!gameStarted ? (
        <div className="start-screen">
          <div className="start-content">
            <h2>🍎 Fruit Ninja</h2>
            <p>Meyveleri dokunarak kes!</p>
            <p>💣 Bombalara dokunma!</p>
            <button className="start-button" onClick={startGame}>
              🎮 Oyuna Başla
            </button>
            
            {/* Nasıl Oynanır */}
            <div className="start-instructions">
              <h3>🎯 Nasıl Oynanır</h3>
              <div className="start-instructions-grid">
                <div className="start-instruction-item">
                  <span>👆</span>
                  <p><strong>Kesme:</strong> Mouse/Parmağınızla meyvelerin üzerinden geçin</p>
                </div>
                <div className="start-instruction-item">
                  <span>🍎</span>
                  <p><strong>Meyveler:</strong> Her meyve farklı puan verir (1-3 puan)</p>
                </div>
                <div className="start-instruction-item">
                  <span>💣</span>
                  <p><strong>Bombalar:</strong> Bombalara dokunmayın - oyun biter!</p>
                </div>
                <div className="start-instruction-item">
                  <span>🔥</span>
                  <p><strong>Combo:</strong> Hızlı kesimlerle bonus puan kazanın</p>
                </div>
                <div className="start-instruction-item">
                  <span>❤️</span>
                  <p><strong>Can:</strong> Meyveleri kaçırırsanız can kaybedersiniz</p>
                </div>
                <div className="start-instruction-item">
                  <span>🎮</span>
                  <p><strong>Hedef:</strong> En yüksek skoru elde etmeye çalışın!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="game-area"
          ref={gameAreaRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Oyun UI */}
          <div className="game-ui">
            <div className="score">Skor: {score}</div>
            <div className="lives">
              Can: {Array.from({length: lives}, (_, i) => '❤️').join('')}
            </div>
            {combo > 1 && (
              <div className="combo">🔥 {combo}x Combo!</div>
            )}
          </div>

          {/* Meyveler */}
          {fruits.map(fruit => (
            <div
              key={fruit.id}
              className={`fruit ${fruit.sliced ? 'sliced' : ''} ${fruit.isBomb ? 'bomb' : ''}`}
              style={{
                left: fruit.x,
                top: fruit.y,
                transform: `rotate(${fruit.rotation}deg)`,
                opacity: fruit.sliced ? 0 : 1
              }}
            >
              <img src={fruit.src} alt={fruit.name} />
              {fruit.sliced && !fruit.isBomb && (
                <div className="slice-effect" style={{ color: fruit.color }}>
                  +{fruit.points * Math.min(combo, 5)}
                </div>
              )}
            </div>
          ))}

          {/* Kesme çizgisi */}
          {sliceTrail.length > 1 && (
            <svg className="slice-trail" style={{ pointerEvents: 'none' }}>
              <path
                d={`M ${sliceTrail.map(p => `${p.x},${p.y}`).join(' L ')}`}
                stroke="#fff"
                strokeWidth="3"
                fill="none"
                opacity="0.8"
              />
            </svg>
          )}

          {/* Game Over */}
          {gameOver && (
            <div className="game-over">
              <div className="game-over-content">
                <h2>🎯 Oyun Bitti!</h2>
                <p>Final Skor: {score}</p>
                <button className="restart-button" onClick={startGame}>
                  🔄 Tekrar Oyna
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FruitNinja;
