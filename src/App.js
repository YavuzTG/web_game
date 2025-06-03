import './AnaSayfa.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './games/sayfa1.css';
import './games/sayfa2.css';

import Sayfa1 from './games/sayfa1'; // ✅ küçük harflerle import
import Sayfa2 from './games/sayfa2'; // ✅ küçük harflerle import

function AnaSayfa() {
  return (
    <div className="ana-sayfa">
      <h1 className="baslik">NEON OYUN PORTALI</h1>
      <p className="aciklama">Bir oyun seç ve oynamaya başla!</p>

      <div className="kutular">
        <Link to="/sayfa1" className="neon-buton">Tic Tac Toe</Link>
        <Link to="/sayfa2" className="neon-buton">Adam Asmaca</Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnaSayfa />} />
        <Route path="/sayfa1" element={<Sayfa1 />} />
        <Route path="/sayfa2" element={<Sayfa2 />} />
      </Routes>
    </Router>
  );
}

export default App;
