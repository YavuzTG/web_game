import './AnaSayfa.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './games/tic-tac-toe.css';
import './games/hangman.css';
import './games/memory-game.css';
import './games/f1-wordle.css';
import './games/cocktail-maker.css';
import './games/fruit-ninja.css'; // ✅ Fruit Ninja CSS
import './games/uwufufu.css';

import Tic_tac_toe from './games/tic-tac-toe';
import Hangman from './games/hangman';
import MemoryGame from './games/memory-game';
import F1Wordle from './games/f1-wordle';
import CocktailMaker from './games/cocktail-maker';
import FruitNinja from './games/fruit-ninja'; // ✅ Fruit Ninja bileşeni
import TestSelection from './games/test-selection';
import Tournament from './games/tournament';

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
          <img src="/assets/anasayfa/uwufufu.png" alt="Tournament" className="oyun-gorsel" />
          <div className="oyun-adi">Uwufufu</div>
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


      </Routes>
    </Router>
  );
}

export default App;
