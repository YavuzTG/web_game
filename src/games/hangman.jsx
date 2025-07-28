import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './hangman.css';

const tumKelimeler = ['programlama', 'oyun', 'bilgisayar', 'internet', 'klavye', 'fare'];

function Hangman() {
  const [karisikKelimeler, setKarisikKelimeler] = useState([]);
  const [kelimeIndex, setKelimeIndex] = useState(0);
  const [kelime, setKelime] = useState('');
  const [tahminler, setTahminler] = useState([]);
  const [hatalar, setHatalar] = useState(0);

  const maxHata = 6;

  useEffect(() => {
    const karisik = [...tumKelimeler].sort(() => Math.random() - 0.5);
    setKarisikKelimeler(karisik);
    setKelime(karisik[0]);
  }, []);

  const handleGuess = (harf) => {
    if (tahminler.includes(harf)) return;

    setTahminler([...tahminler, harf]);
    if (!kelime.includes(harf)) {
      setHatalar(hatalar + 1);
    }
  };

  const kelimeyiGoster = kelime
    .split('')
    .map((harf) => (tahminler.includes(harf) ? harf : '_'))
    .join(' ');

  const oyunuKaybettin = hatalar >= maxHata;
  const oyunuKazandin = kelimeyiGoster.replace(/ /g, '') === kelime;

  // Klavye desteği - oyun durumu değişkenlerinden sonra tanımlanmalı
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Oyun bittiğinde klavye girişini engelle
      if (oyunuKazandin || oyunuKaybettin) return;

      const basiliHarf = event.key.toLowerCase();
      const turkceHarfler = 'qwertyuıopğüasdfghjklşizxcvbnmöç';
      
      // Sadece Türkçe harflere izin ver
      if (turkceHarfler.includes(basiliHarf)) {
        handleGuess(basiliHarf);
      }
    };

    // Event listener ekle
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [tahminler, oyunuKazandin, oyunuKaybettin, kelime, hatalar]); // Dependencies array

  const oyunuYenidenBaslat = () => {
    const sonrakiIndex = kelimeIndex + 1;

    if (sonrakiIndex < karisikKelimeler.length) {
      setKelime(karisikKelimeler[sonrakiIndex]);
      setKelimeIndex(sonrakiIndex);
      setTahminler([]);
      setHatalar(0);
    } else {
      const yeniKarisik = [...tumKelimeler].sort(() => Math.random() - 0.5);
      setKarisikKelimeler(yeniKarisik);
      setKelimeIndex(0);
      setKelime(yeniKarisik[0]);
      setTahminler([]);
      setHatalar(0);
    }
  };

  return (
    <div className="hangman-container">
      <div className="hangman-header">
        <Link to="/" className="back-button">← Ana Sayfa</Link>
        <h1>Adam Asmaca</h1>
      </div>

      <div className="hangman-game">
        <div className="game-info">
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Hatalar:</span>
              <span className="stat-value">{hatalar} / {maxHata}</span>
            </div>
          </div>
        </div>

        <div className="game-area">
          <div className="asmaca-container">
            <div className="cizgi g-dik"></div>
            <div className="cizgi g-ver"></div>
            <div className="cizgi g-ip"></div>

            {hatalar > 0 && <div className="kafa"></div>}
            {hatalar > 1 && <div className="govde"></div>}
            {hatalar > 2 && <div className="kol-sol"></div>}
            {hatalar > 3 && <div className="kol-sag"></div>}
            {hatalar > 4 && <div className="bacak-sol"></div>}
            {hatalar > 5 && <div className="bacak-sag"></div>}
          </div>

          <div className="kelime-bolumu">
            <p className="kelime-label">Kelime:</p>
            <div className="kelime">{kelimeyiGoster}</div>
          </div>
        </div>

        <div className="game-controls">
          {oyunuKazandin && (
            <div className="game-result win">
              <p>🎉 Tebrikler, kazandın!</p>
              <button className="hangman-button restart-button" onClick={oyunuYenidenBaslat}>Yeni Oyun</button>
            </div>
          )}

          {oyunuKaybettin && (
            <div className="game-result lose">
              <p>😢 Kaybettin! Kelime: <strong>{kelime}</strong></p>
              <button className="hangman-button restart-button" onClick={oyunuYenidenBaslat}>Yeniden Dene</button>
            </div>
          )}

          <div className="harfler">
            <div className="harf-satiri">
              {'qwertyuıopğü'.split('').map(harf => (
                <button
                  key={harf}
                  className={`harf ${tahminler.includes(harf) ? (kelime.includes(harf) ? 'correct' : 'wrong') : ''}`}
                  onClick={() => handleGuess(harf)}
                  disabled={tahminler.includes(harf) || oyunuKazandin || oyunuKaybettin}
                >
                  {harf}
                </button>
              ))}
            </div>
            <div className="harf-satiri">
              {'asdfghjklşi'.split('').map(harf => (
                <button
                  key={harf}
                  className={`harf ${tahminler.includes(harf) ? (kelime.includes(harf) ? 'correct' : 'wrong') : ''}`}
                  onClick={() => handleGuess(harf)}
                  disabled={tahminler.includes(harf) || oyunuKazandin || oyunuKaybettin}
                >
                  {harf}
                </button>
              ))}
            </div>
            <div className="harf-satiri">
              {'zxcvbnmöç'.split('').map(harf => (
                <button
                  key={harf}
                  className={`harf ${tahminler.includes(harf) ? (kelime.includes(harf) ? 'correct' : 'wrong') : ''}`}
                  onClick={() => handleGuess(harf)}
                  disabled={tahminler.includes(harf) || oyunuKazandin || oyunuKaybettin}
                >
                  {harf}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="game-instructions">
          <h3>Nasıl Oynanır?</h3>
          <ul>
            <li>Gizli kelimeyi tahmin etmeye çalışın</li>
            <li>Harflere tıklayarak veya <strong>klavyeden basarak</strong> tahmin yapın</li>
            <li>Yanlış tahmin yaparsanız adam asılmaya başlar</li>
            <li>6 yanlış tahmin hakkınız var</li>
            <li>Kelimeyi tamamlamadan önce adam asılırsa kaybedersiniz</li>
            <li>Tüm harfleri doğru tahmin ederseniz kazanırsınız</li>
            <li><strong>💡 İpucu:</strong> Klavyenizdeki herhangi bir harfe basabilirsiniz!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Hangman;
