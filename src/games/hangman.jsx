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
      <h1>Adam Asmaca</h1>

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

      <p>Kelime: <span className="kelime">{kelimeyiGoster}</span></p>
      <p>Hatalar: {hatalar} / {maxHata}</p>

      {oyunuKazandin && (
        <>
          <p className="kazandın">🎉 Tebrikler, kazandın!</p>
          <button className="yeniden-baslat" onClick={oyunuYenidenBaslat}>Yeni Oyun</button>
        </>
      )}

      {oyunuKaybettin && (
        <>
          <p className="kaybettin">😢 Kaybettin! Kelime: {kelime}</p>
          <button className="yeniden-baslat" onClick={oyunuYenidenBaslat}>Yeniden Dene</button>
        </>
      )}

      <div className="harfler">
        <div className="harf-satiri">
          {'qwertyuıopğü'.split('').map(harf => (
            <button
              key={harf}
              className="harf"
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
              className="harf"
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
              className="harf"
              onClick={() => handleGuess(harf)}
              disabled={tahminler.includes(harf) || oyunuKazandin || oyunuKaybettin}
            >
              {harf}
            </button>
          ))}
        </div>
      </div>

      <Link to="/" className="back-link">Ana Sayfaya Dön</Link>
    </div>
  );
}

export default Hangman;
