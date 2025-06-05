import './AnaSayfa.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './games/tic-tac-toe.css';
import './games/hangman.css';
import './games/memory-game.css';
import './games/f1-wordle.css';
import './games/cocktail-maker.css'; // ✅ yeni css eklendi

import Tic_tac_toe from './games/tic-tac-toe';
import Hangman from './games/hangman';
import MemoryGame from './games/memory-game';
import F1Wordle from './games/f1-wordle';
import CocktailMaker from './games/cocktail-maker'; // ✅ yeni oyun bileşeni

function AnaSayfa() {
  return (
    <div className="ana-sayfa">
      <h1 className="baslik">NEON OYUN PORTALI</h1>
      <p className="aciklama">Bir oyun seç ve oynamaya başla!</p>

      <div className="kutular">
        <Link to="/tic-tac-toe" className="neon-buton">Tic Tac Toe</Link>
        <Link to="/hangman" className="neon-buton">Adam Asmaca</Link>
        <Link to="/memory-game" className="neon-buton">Kart Eşleme Oyunu</Link>
        <Link to="/f1-wordle" className="neon-buton">F1 Wordle</Link>
        <Link to="/cocktail-maker" className="neon-buton">Kokteyl Yapma Oyunu</Link> {/* ✅ yeni buton */}
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
        <Route path="/cocktail-maker" element={<CocktailMaker />} /> {/* ✅ yeni rota */}
      </Routes>
    </Router>
  );
}

export default App;
