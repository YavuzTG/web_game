import React from 'react';
import { Link } from 'react-router-dom';
import './sayfa1.css'; // CSS dosyasını import ediyoruz

function sayfa1() {
  return (
    <div className="sayfa1-container">
      <h1>Sayfa 1 Başlık</h1>
      <p>Bu, Sayfa 1 içeriği için örnek paragraf.</p>
      <Link to="/" className="back-link">Ana Sayfaya Dön</Link>
    </div>
  );
}

export default sayfa1;
