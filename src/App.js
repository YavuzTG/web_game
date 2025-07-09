import './AnaSayfa.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './games/tic-tac-toe.css';
import './games/hangman.css';
import './games/memory-game.css';
import './games/f1-wordle.css';
import './games/cocktail-maker.css';
import './games/fruit-ninja.css';
import './games/uwufufu.css';
import './games/game-2048.css'; // ✅ 2048 CSS
import './games/dino-game.css';
import './games/car-game.css';
import './games/minesweeper.css';
import './games/color-mixer.css';

import Tic_tac_toe from './games/tic-tac-toe';
import Hangman from './games/hangman';
import MemoryGame from './games/memory-game';
import F1Wordle from './games/f1-wordle';
import CocktailMaker from './games/cocktail-maker';
import FruitNinja from './games/fruit-ninja';
import TestSelection from './games/test-selection';
import Tournament from './games/tournament';
import Game2048 from './games/game-2048'; // ✅ 2048 bileşeni
import DinoGame from './games/dino-game';
import CarGame from './games/car-game';
import Minesweeper from './games/minesweeper';
import ColorMixer from './games/color-mixer';

function AnaSayfa() {
  return (
    <div className="ana-sayfa">
      <h1 className="baslik">NEON OYUN PORTALI</h1>
      <p className="aciklama">Bir oyun seç ve oynamaya başla!</p>

      <div className="kutular">
        <Link to="/tic-tac-toe" className="oyun-karti">
          <img src="/assets/anasayfa/tic-tac-toe.png" alt="Tic Tac Toe" className="oyun-gorsel" />
          <div className="oyun-adi">Tic Tac Toe</div>
        </Link>

        <Link to="/hangman" className="oyun-karti">
          <img src="/assets/anasayfa/hangman.png" alt="Adam Asmaca" className="oyun-gorsel" />
          <div className="oyun-adi">Adam Asmaca</div>
        </Link>

        <Link to="/memory-game" className="oyun-karti">
          <img src="/assets/anasayfa/memory-game.png" alt="Kart Eşleme" className="oyun-gorsel" />
          <div className="oyun-adi">Kart Eşleme</div>
        </Link>

        <Link to="/f1-wordle" className="oyun-karti">
          <img src="/assets/anasayfa/f1-wordle.png" alt="F1 Wordle" className="oyun-gorsel" />
          <div className="oyun-adi">F1 Wordle</div>
        </Link>

        <Link to="/cocktail-maker" className="oyun-karti">
          <img src="/assets/anasayfa/cocktail-maker.png" alt="Kokteyl Yapma Oyunu" className="oyun-gorsel" />
          <div className="oyun-adi">Kokteyl Yapma</div>
        </Link>

        <Link to="/fruit-ninja" className="oyun-karti">
          <img src="/assets/anasayfa/fruit-ninja.png" alt="Fruit Ninja" className="oyun-gorsel" />
          <div className="oyun-adi">Fruit Ninja</div>
        </Link>

        <Link to="/tournament" className="oyun-karti">
          <img src="/assets/anasayfa/tournament.png" alt="Tournament" className="oyun-gorsel" />
          <div className="oyun-adi">Uwufufu</div>
        </Link>

        <Link to="/game-2048" className="oyun-karti"> {/* ✅ Yeni kutu */}
          <img src="/assets/anasayfa/game-2048.png" alt="2048" className="oyun-gorsel" />
          <div className="oyun-adi">2048</div>
        </Link>

        <Link to="/dino-game" className="oyun-karti">
          <img src="/assets/anasayfa/dino-game.png" alt="Engelden Kaçış" className="oyun-gorsel" />
          <div className="oyun-adi">Engelden Kaçış</div>
        </Link>

        <Link to="/car-game" className="oyun-karti">
          <img src="/assets/anasayfa/car-game.png" alt="Araba" className="oyun-gorsel" />
          <div className="oyun-adi">Araba</div>
        </Link>

        <Link to="/minesweeper" className="oyun-karti">
          <img src="/assets/anasayfa/minesweeper.png" alt="Minesweeper" className="oyun-gorsel" />
         <div className="oyun-adi">Mayın Tarlası</div>
        </Link>

        <Link to="/color-mixer" className="oyun-karti">
          <img src="/assets/anasayfa/color-mixer.png" alt="Renk Karıştırma" className="oyun-gorsel" />
          <div className="oyun-adi">Renk Karıştır</div>
        </Link>

      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnaSayfa />} />
        <Route path="/tic-tac-toe" element={<Tic_tac_toe />} />
        <Route path="/hangman" element={<Hangman />} />
        <Route path="/memory-game" element={<MemoryGame />} />
        <Route path="/f1-wordle" element={<F1Wordle />} />
        <Route path="/cocktail-maker" element={<CocktailMaker />} />
        <Route path="/fruit-ninja" element={<FruitNinja />} />
        <Route path="/tournament" element={<TestSelection />} />
        <Route path="/tournament/:testId" element={<Tournament />} />
        <Route path="/game-2048" element={<Game2048 />} /> {/* ✅ 2048 rotası */}
        <Route path="/dino-game" element={<DinoGame />} />
        <Route path="/car-game" element={<CarGame />} />
        <Route path="/minesweeper" element={<Minesweeper />} />
        <Route path="/color-mixer" element={<ColorMixer />} />
        

      </Routes>
    </Router>
  );
}

export default App;
