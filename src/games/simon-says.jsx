import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './simon-says.css';

const SimonSays = () => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('simonHighScore')) || 0
  );
  const [gameStatus, setGameStatus] = useState('Başlamak için START butonuna tıkla!');
  const [activeColor, setActiveColor] = useState(null);
  const [speed, setSpeed] = useState(600);

  const colors = useMemo(() => ['red', 'blue', 'green', 'yellow'], []);
  const sounds = useMemo(() => ({
    red: 440,    // A note
    blue: 523,   // C note
    green: 659,  // E note
    yellow: 784  // G note
  }), []);

  // Ses çalma fonksiyonu
  const playSound = useCallback((frequency) => {
    try {
      if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // AudioContext'in suspended durumda olup olmadığını kontrol et
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        
        // Context'i temizle
        setTimeout(() => {
          if (audioContext.state !== 'closed') {
            audioContext.close();
          }
        }, 400);
      }
    } catch (error) {
      console.log('Ses çalınamadı:', error);
    }
  }, []);

  // Renk gösterme fonksiyonu
  const showColor = useCallback((color, duration = 400) => {
    setActiveColor(color);
    playSound(sounds[color]);
    setTimeout(() => setActiveColor(null), duration);
  }, [playSound, sounds]);

  // Sırayı gösterme fonksiyonu
  const showSequence = useCallback(async () => {
    if (!isGameActive) return;
    
    setIsPlayerTurn(false);
    setGameStatus('Sırayı izle...');
    
    for (let i = 0; i < sequence.length; i++) {
      if (!isGameActive) break; // Oyun durdurulmuşsa döngüyü kır
      
      await new Promise(resolve => setTimeout(resolve, speed));
      
      if (!isGameActive) break; // Tekrar kontrol et
      
      showColor(sequence[i], Math.max(300, speed - 100));
    }
    
    if (isGameActive) {
      setTimeout(() => {
        if (isGameActive) {
          setIsPlayerTurn(true);
          setGameStatus('Sıranı tekrar et!');
        }
      }, speed);
    }
  }, [sequence, showColor, speed, isGameActive]);

  // Yeni tur başlatma
  const nextRound = useCallback(() => {
    if (!isGameActive) return;
    
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    const newSequence = [...sequence, nextColor];
    setSequence(newSequence);
    setPlayerSequence([]);
    setScore(prev => prev + 1);
    
    // Oyun hızlanır
    if (newSequence.length > 10) {
      setSpeed(300);
    } else if (newSequence.length > 5) {
      setSpeed(400);
    }
  }, [sequence, colors, isGameActive]);

  // Oyun başlatma
  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setIsGameActive(true);
    setIsPlayerTurn(false);
    setActiveColor(null);
    setSpeed(600);
    setGameStatus('Oyun başlıyor...');
    
    setTimeout(() => {
      const firstColor = colors[Math.floor(Math.random() * colors.length)];
      setSequence([firstColor]);
    }, 1000);
  };

  // Oyun bitirme
  const endGame = useCallback(() => {
    setIsGameActive(false);
    setIsPlayerTurn(false);
    setActiveColor(null);
    setGameStatus(`Oyun bitti! Skorun: ${score}`);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('simonHighScore', score.toString());
      setGameStatus(`Yeni rekor! Skorun: ${score}`);
    }
    
    // Yanlış ses
    setTimeout(() => playSound(150), 100);
  }, [score, highScore, playSound]);

  // Renk tıklama
  const handleColorClick = useCallback((color) => {
    if (!isPlayerTurn || !isGameActive) return;
    
    showColor(color, 200);
    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);
    
    // Doğru mu kontrol et
    const currentIndex = newPlayerSequence.length - 1;
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      endGame();
      return;
    }
    
    // Sıra tamamlandı mı?
    if (newPlayerSequence.length === sequence.length) {
      setIsPlayerTurn(false);
      setGameStatus('Harika! Bir sonraki tur...');
      setTimeout(() => {
        if (isGameActive) {
          nextRound();
        }
      }, 1000);
    }
  }, [isPlayerTurn, isGameActive, playerSequence, sequence, showColor, endGame, nextRound]);

  // Sequence değiştiğinde sırayı göster
  useEffect(() => {
    if (sequence.length > 0 && isGameActive) {
      showSequence();
    }
  }, [sequence, isGameActive, showSequence]);

  return (
    <div className="simon-container">
      <div className="simon-header">
        <Link to="/" className="back-button">← Ana Sayfa</Link>
        <h1>Simon Says</h1>
      </div>

      <div className="simon-game">
        <div className="game-info">
          <div className="score-board">
            <div className="score">Skor: {score}</div>
            <div className="high-score">En Yüksek: {highScore}</div>
          </div>
          <div className="game-status">{gameStatus}</div>
        </div>

        <div className="simon-board">
          {colors.map((color) => (
            <button
              key={color}
              className={`simon-button ${color} ${activeColor === color ? 'active' : ''}`}
              onClick={() => handleColorClick(color)}
              disabled={!isPlayerTurn}
            />
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
            <li>Simon renkli sırayı gösterir</li>
            <li>Aynı sırayı tekrar et</li>
            <li>Her tur yeni bir renk eklenir</li>
            <li>Yanlış sırada oyun biter</li>
            <li>Mümkün olduğunca uzun sıra yap!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimonSays;
