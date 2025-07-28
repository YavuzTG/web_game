import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './whack-a-mole.css';

const WhackAMole = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameActive, setIsGameActive] = useState(false);
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [gameStatus, setGameStatus] = useState('Başlamak için START butonuna tıkla!');
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('whackMoleHighScore')) || 0
  );
  const [hitMole, setHitMole] = useState(null);
  const [difficulty, setDifficulty] = useState('normal');

  // Zorluk seviyeleri
  const difficultySettings = useMemo(() => ({
    easy: { interval: 1200, duration: 1500, points: 10 },
    normal: { interval: 800, duration: 1200, points: 15 },
    hard: { interval: 600, duration: 900, points: 20 }
  }), []);

  const currentSettings = difficultySettings[difficulty];

  // Köstebek gösterme fonksiyonu
  const showMole = useCallback(() => {
    if (!isGameActive) return;

    // Rastgele köstebek pozisyonu seç
    const randomIndex = Math.floor(Math.random() * 9);
    
    setMoles(prev => {
      const newMoles = [...prev];
      newMoles[randomIndex] = true;
      return newMoles;
    });

    // Belirlenen süre sonra köstebeği gizle
    setTimeout(() => {
      setMoles(prev => {
        const newMoles = [...prev];
        newMoles[randomIndex] = false;
        return newMoles;
      });
    }, currentSettings.duration);
  }, [isGameActive, currentSettings.duration]);

  // Köstebek vurma fonksiyonu
  const whackMole = useCallback((index) => {
    if (!isGameActive || !moles[index]) return;

    // Köstebeği vur
    setMoles(prev => {
      const newMoles = [...prev];
      newMoles[index] = false;
      return newMoles;
    });

    // Skor ekle
    setScore(prev => prev + currentSettings.points);
    
    // Hit efekti
    setHitMole(index);
    setTimeout(() => setHitMole(null), 200);

    // Hit sesi (basit beep)
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      
      setTimeout(() => {
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
      }, 150);
    } catch (error) {
      console.log('Ses çalınamadı:', error);
    }
  }, [isGameActive, moles, currentSettings.points]);

  // Oyun başlatma
  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(30);
    setIsGameActive(true);
    setMoles(Array(9).fill(false));
    setGameStatus('Köstebekleri vur!');
    setHitMole(null);
  }, []);

  // Oyun bitirme
  const endGame = useCallback(() => {
    setIsGameActive(false);
    setMoles(Array(9).fill(false));
    setGameStatus(`Oyun bitti! Skorun: ${score}`);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('whackMoleHighScore', score.toString());
      setGameStatus(`Yeni rekor! Skorun: ${score}`);
    }
  }, [score, highScore]);

  // Oyun zamanlayıcısı
  useEffect(() => {
    let timer;
    if (isGameActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isGameActive) {
      endGame();
    }

    return () => clearTimeout(timer);
  }, [timeLeft, isGameActive, endGame]);

  // Köstebek gösterme döngüsü
  useEffect(() => {
    let interval;
    if (isGameActive) {
      interval = setInterval(() => {
        showMole();
      }, currentSettings.interval);
    }

    return () => clearInterval(interval);
  }, [isGameActive, showMole, currentSettings.interval]);

  // Zorluk değiştirme
  const changeDifficulty = (newDifficulty) => {
    if (!isGameActive) {
      setDifficulty(newDifficulty);
    }
  };

  return (
    <div className="whack-container">
      <div className="whack-header">
        <Link to="/" className="back-button">← Ana Sayfa</Link>
        <h1>🔨 Whack-a-Mole</h1>
      </div>

      <div className="whack-game">
        <div className="game-info">
          <div className="score-board">
            <div className="score">Skor: {score}</div>
            <div className="timer">Süre: {timeLeft}s</div>
            <div className="high-score">En Yüksek: {highScore}</div>
          </div>
          <div className="game-status">{gameStatus}</div>
        </div>

        <div className="difficulty-selector">
          <h3>Zorluk Seviyesi:</h3>
          <div className="difficulty-buttons">
            {Object.keys(difficultySettings).map(level => (
              <button
                key={level}
                className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
                onClick={() => changeDifficulty(level)}
                disabled={isGameActive}
              >
                {level === 'easy' ? 'Kolay' : level === 'normal' ? 'Normal' : 'Zor'}
              </button>
            ))}
          </div>
        </div>

        <div className="mole-grid">
          {moles.map((isVisible, index) => (
            <div key={index} className="mole-hole">
              <div className="hole"></div>
              {isVisible && (
                <div 
                  className={`mole visible ${hitMole === index ? 'hit' : ''}`}
                  onClick={() => whackMole(index)}
                >
                  🐭
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="game-controls">
          {!isGameActive ? (
            <button className="start-button" onClick={startGame}>
              {score > 0 ? 'Tekrar Oyna' : 'Başla'}
            </button>
          ) : (
            <button className="stop-button" onClick={endGame}>
              Durdur
            </button>
          )}
        </div>

        <div className="game-instructions">
          <h3>Nasıl Oynanır?</h3>
          <ul>
            <li>Deliklerden çıkan köstebekleri vurun</li>
            <li>Her vurduğunuz köstebek için puan kazanın</li>
            <li>30 saniye içinde en yüksek skoru yapın</li>
            <li>Zorluk seviyesi arttıkça daha fazla puan</li>
            <li>Hızlı olun, köstebek hızla saklanıyor!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WhackAMole;
