import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './piano-tiles.css';

const PianoTiles = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => 
    parseInt(localStorage.getItem('pianoTilesHighScore')) || 0
  );
  const [gameRunning, setGameRunning] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(800);
  const [tiles, setTiles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [missedTiles, setMissedTiles] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);

  // Piano notaları ve ses frekansları
  const notes = useMemo(() => [
    { note: 'C4', frequency: 261.63, color: '#FF6B6B' },
    { note: 'D4', frequency: 293.66, color: '#4ECDC4' },
    { note: 'E4', frequency: 329.63, color: '#45B7D1' },
    { note: 'F4', frequency: 349.23, color: '#96CEB4' },
    { note: 'G4', frequency: 392.00, color: '#FFEAA7' },
    { note: 'A4', frequency: 440.00, color: '#DDA0DD' },
    { note: 'B4', frequency: 493.88, color: '#98D8C8' },
    { note: 'C5', frequency: 523.25, color: '#FF7675' }
  ], []);

  // Ses çalma fonksiyonu
  const playNote = useCallback((frequency) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported');
    }
  }, []);

  // Yeni tile oluşturma
  const createNewTile = useCallback(() => {
    const column = Math.floor(Math.random() * 4);
    const noteIndex = Math.floor(Math.random() * notes.length);
    const newTile = {
      id: Date.now() + Math.random(),
      column,
      row: 0,
      note: notes[noteIndex],
      clicked: false,
      missed: false
    };
    return newTile;
  }, [notes]);

  // Oyunu başlatma
  const startGame = useCallback(() => {
    setGameRunning(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setMissedTiles(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setGameSpeed(800);
    setTiles([createNewTile()]);
  }, [createNewTile]);

  // Oyunu durdurma
  const stopGame = useCallback(() => {
    setGameRunning(false);
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('pianoTilesHighScore', score.toString());
    }
  }, [score, highScore]);

  // Tile'a tıklama
  const handleTileClick = useCallback((tileId) => {
    if (!gameRunning || gameOver) return;

    const clickedTile = tiles.find(tile => tile.id === tileId);
    if (!clickedTile || clickedTile.clicked || clickedTile.missed) return;

    // Aynı sütundaki en alt sıradaki tile'ı bul
    const tilesInColumn = tiles.filter(tile => 
      tile.column === clickedTile.column && !tile.clicked && !tile.missed
    );
    const bottomTile = tilesInColumn.reduce((bottom, current) => 
      current.row > bottom.row ? current : bottom
    );

    // Eğer tıklanan tile en alttaki değilse can kaybı
    if (clickedTile.id !== bottomTile.id) {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameRunning(false);
          setGameOver(true);
        }
        return newLives;
      });
      setCombo(0);
      return;
    }

    setTiles(prevTiles => {
      const updatedTiles = prevTiles.map(tile => {
        if (tile.id === tileId) {
          playNote(tile.note.frequency);
          setScore(prev => prev + 10 + (combo * 2));
          setCombo(prev => {
            const newCombo = prev + 1;
            setMaxCombo(current => Math.max(current, newCombo));
            return newCombo;
          });
          return { ...tile, clicked: true };
        }
        return tile;
      });
      return updatedTiles;
    });
  }, [gameRunning, gameOver, tiles, playNote, combo]);

  // Boş alana tıklama kontrolü
  const handleGridClick = useCallback((event) => {
    if (!gameRunning || gameOver) return;
    
    // Eğer tıklanan element bir tile değilse (boş alan)
    if (event.target.classList.contains('piano-grid')) {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameRunning(false);
          setGameOver(true);
        }
        return newLives;
      });
      setCombo(0);
    }
  }, [gameRunning, gameOver]);

  // Oyun döngüsü
  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const gameInterval = setInterval(() => {
      setTiles(prevTiles => {
        let newTiles = [...prevTiles];
        let hasNewMiss = false;

        // Mevcut tile'ları aşağı hareket ettir
        newTiles = newTiles.map(tile => {
          if (tile.row >= 20 && !tile.clicked) {
            if (!tile.missed) {
              hasNewMiss = true;
              setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                  setGameRunning(false);
                  setGameOver(true);
                }
                return newLives;
              });
              setCombo(0);
            }
            return { ...tile, missed: true };
          }
          return { ...tile, row: tile.row + 1 };
        });

        // Lives 0'a ulaştıysa oyunu bitir
        if (lives <= 0) {
          setGameRunning(false);
          setGameOver(true);
          return newTiles;
        }

        // Eski tile'ları temizle (daha aşağıya kadar gidebilsin)
        newTiles = newTiles.filter(tile => tile.row <= 25);

        // Yeni tile ekle
        if (Math.random() < 0.7) {
          newTiles.push(createNewTile());
        }

        return newTiles;
      });

      // Level ve hız artırma
      if (score > level * 100) {
        setLevel(prev => prev + 1);
        setGameSpeed(prev => Math.max(200, prev - 50));
      }
    }, gameSpeed);

    return () => clearInterval(gameInterval);
  }, [gameRunning, gameOver, gameSpeed, score, level, lives, createNewTile]);

  // Klavye kontrolleri
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameRunning || gameOver) return;

      let column = -1;
      switch(e.key.toLowerCase()) {
        case 'a':
        case '1':
          column = 0;
          break;
        case 's':
        case '2':
          column = 1;
          break;
        case 'd':
        case '3':
          column = 2;
          break;
        case 'f':
        case '4':
          column = 3;
          break;
        default:
          return;
      }

      // En alt sıradaki tile'ı bul ve tıkla
      const bottomTile = tiles
        .filter(tile => tile.column === column && !tile.clicked && !tile.missed)
        .sort((a, b) => b.row - a.row)[0];

      if (bottomTile) {
        handleTileClick(bottomTile.id);
      } else {
        // Eğer o sütunda tile yoksa can kaybı
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameRunning(false);
            setGameOver(true);
          }
          return newLives;
        });
        setCombo(0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameRunning, gameOver, tiles, handleTileClick]);

  return (
    <div className="piano-tiles-container">
      <div className="piano-tiles-header">
        <Link to="/" className="back-button">← Ana Sayfa</Link>
        <h1>Piano Tiles</h1>
      </div>

      <div className="piano-tiles-game">
        <div className="game-info">
          <div className="score-board">
            <div className="score">Skor: {score}</div>
            <div className="level">Level: {level}</div>
            <div className="combo">Combo: {combo}</div>
            <div className="lives">Can: {lives}</div>
            <div className="high-score">En Yüksek: {highScore}</div>
          </div>

          <div className="game-stats">
            <div className="stat">
              <span>Max Combo: {maxCombo}</span>
            </div>
          </div>

          <div className="game-status">
            {!gameRunning && !gameOver && "Oyunu başlatmak için START'a basın"}
            {gameRunning && "Siyah karelere tıklayın veya tuşlara basın!"}
            {gameOver && "Oyun Bitti! Tekrar denemek için START'a basın"}
          </div>
        </div>

        <div className="game-area">
          <div className="piano-grid" onClick={handleGridClick}>
            {/* Grid arka plan */}
            {Array.from({ length: 25 }, (_, row) =>
              Array.from({ length: 4 }, (_, col) => (
                <div
                  key={`${row}-${col}`}
                  className="grid-cell"
                  style={{
                    left: `${col * 25}%`,
                    top: `${row * 4}%`,
                    width: '25%',
                    height: '4%'
                  }}
                />
              ))
            )}

            {/* Aktif tile'lar */}
            {tiles.map(tile => (
              <div
                key={tile.id}
                className={`piano-tile ${tile.clicked ? 'clicked' : ''} ${tile.missed ? 'missed' : ''}`}
                style={{
                  left: `${tile.column * 25}%`,
                  top: `${tile.row * 4}%`,
                  width: '25%',
                  height: '4%',
                  backgroundColor: tile.clicked ? tile.note.color : (tile.missed ? '#ff4757' : '#2c3e50')
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTileClick(tile.id);
                }}
              />
            ))}
          </div>
        </div>

        <div className="game-controls">
          {!gameRunning ? (
            <button className="start-button" onClick={startGame}>
              {gameOver ? 'Tekrar Başla' : 'Başla'}
            </button>
          ) : (
            <button className="stop-button" onClick={stopGame}>
              Durdur
            </button>
          )}
        </div>

        <div className="controls-info">
          <h3>Kontroller</h3>
          <div className="control-grid">
            <div className="control-item">
              <div className="key">A / 1</div>
              <span>1. Sütun</span>
            </div>
            <div className="control-item">
              <div className="key">S / 2</div>
              <span>2. Sütun</span>
            </div>
            <div className="control-item">
              <div className="key">D / 3</div>
              <span>3. Sütun</span>
            </div>
            <div className="control-item">
              <div className="key">F / 4</div>
              <span>4. Sütun</span>
            </div>
          </div>
        </div>

        <div className="game-instructions">
          <h3>Nasıl Oynanır?</h3>
          <ul>
            <li>Siyah kareler yukarıdan aşağıya düşer</li>
            <li>Sadece her sütundaki EN ALTTAKİ kareye tıklayabilirsiniz</li>
            <li>Yanlış kareye veya boş alana tıklarsanız can kaybedersiniz</li>
            <li>Her doğru tıklama puan kazandırır ve piano sesi çalar</li>
            <li>Combo yaparak daha fazla puan kazanın</li>
            <li>3 can kaybederse oyun biter</li>
            <li>Level atladıkça hız artar</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PianoTiles;
