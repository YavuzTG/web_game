import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './cocktail-maker.css';

const malzemeler = [
  'Limon', 'Nane', 'Rom', 'Şeker Şurubu', 'Soda',
  'Votka', 'Portakal Suyu', 'Yaban Mersini', 'Karpuz', 'Greyfurt',
  'Ananas Suyu', 'Nar Şurubu', 'Buz', 'Zencefil', 'Elma Suyu',
  'Campari', 'Triple Sec', 'Tekila', 'Kahve Likörü', 'Tonik',
  'Domates Suyu', 'Tuz', 'Lime', 'Krem Şanti', 'Viski', 'Cin',
  'Cachaça', 'Kola', 'Şampanya', 'Espresso', 'Zencefil Birası',
  'Şeftali Likörü', 'Kızılcık Suyu', 'Blue Curacao', 'Pisco',
  'Grenadin', 'Drambuie', 'Vermut', 'Aperol', 'Chambord',
  'Maraschino Likörü', 'Violet Likörü', 'Rye Viski', 'Peychaud’s Bitters',
  'Absinthe', 'Şeftali Püresi', 'Lillet Blanc', 'Vanilya Şurubu'
];

const renkler = {
  'Limon': '#F9F871',
  'Nane': '#A1E887',
  'Rom': '#D9B48F',
  'Şeker Şurubu': '#FFFFFF',
  'Soda': '#C2E7F0',
  'Votka': '#E6E6E6',
  'Portakal Suyu': '#FFA500',
  'Yaban Mersini': '#4B0082',
  'Karpuz': '#FF4C4C',
  'Greyfurt': '#F07F5A',
  'Ananas Suyu': '#FFE135',
  'Nar Şurubu': '#D2222D',
  'Buz': '#E0F7FA',
  'Zencefil': '#D2B48C',
  'Elma Suyu': '#A2C523',
  'Campari': '#FF4040',
  'Triple Sec': '#FFEBCD',
  'Tekila': '#F7E7CE',
  'Kahve Likörü': '#4B3621',
  'Tonik': '#B0E0E6',
  'Domates Suyu': '#FF6347',
  'Tuz': '#D9D9D9',
  'Lime': '#C7EA46',
  'Krem Şanti': '#FFFDD0',
  'Viski': '#B5651D',
  'Cin': '#B0C4DE',
  'Cachaça': '#F5DEB3',
  'Kola': '#3B2F2F',
  'Şampanya': '#F7E7CE',
  'Espresso': '#4B3621',
  'Zencefil Birası': '#D2B48C',
  'Şeftali Likörü': '#FFDAB9',
  'Kızılcık Suyu': '#B22222',
  'Blue Curacao': '#1E90FF',
  'Pisco': '#FFE4B5',
  'Grenadin': '#DC143C',
  'Drambuie': '#8B4513',
  'Vermut': '#BC8F8F',
  'Aperol': '#FF4500',
  'Chambord': '#800020',
  'Maraschino Likörü': '#FF69B4',
  'Violet Likörü': '#8A2BE2',
  'Rye Viski': '#CD853F',
  'Peychaud’s Bitters': '#800000',
  'Absinthe': '#7FFF00',
  'Şeftali Püresi': '#FFE5B4',
  'Lillet Blanc': '#FFFACD',
  'Vanilya Şurubu': '#F3E5AB',
};

const tarifler = [
  { ad: "Mojito", malzemeler: ['Limon', 'Nane', 'Rom', 'Şeker Şurubu', 'Soda'] },
  { ad: "Screwdriver", malzemeler: ['Votka', 'Portakal Suyu'] },
  { ad: "Bloody Mary", malzemeler: ['Votka', 'Domates Suyu', 'Limon', 'Tuz'] },
  { ad: "Cosmopolitan", malzemeler: ['Votka', 'Triple Sec', 'Lime', 'Nar Şurubu'] },
  { ad: "Margarita", malzemeler: ['Tekila', 'Triple Sec', 'Lime', 'Tuz'] },
  { ad: "Piña Colada", malzemeler: ['Rom', 'Ananas Suyu', 'Krem Şanti'] },
  { ad: "Mai Tai", malzemeler: ['Rom', 'Lime', 'Şeker Şurubu', 'Triple Sec'] },
  { ad: "Whiskey Sour", malzemeler: ['Viski', 'Limon', 'Şeker Şurubu'] },
  { ad: "Gin Tonic", malzemeler: ['Cin', 'Tonik', 'Lime'] },
  { ad: "Caipirinha", malzemeler: ['Cachaça', 'Lime', 'Şeker Şurubu'] },
  { ad: "Long Island Iced Tea", malzemeler: ['Votka', 'Cin', 'Rom', 'Tekila', 'Triple Sec', 'Kola', 'Limon'] },
  { ad: "French 75", malzemeler: ['Cin', 'Şampanya', 'Limon', 'Şeker Şurubu'] },
  { ad: "Black Russian", malzemeler: ['Votka', 'Kahve Likörü'] },
  { ad: "White Russian", malzemeler: ['Votka', 'Kahve Likörü', 'Krem Şanti'] },
  { ad: "Negroni", malzemeler: ['Cin', 'Campari', 'Vermut'] },
  { ad: "Aperol Spritz", malzemeler: ['Aperol', 'Şampanya', 'Soda'] },
  { ad: "Espresso Martini", malzemeler: ['Votka', 'Kahve Likörü', 'Espresso'] },
  { ad: "Dark 'n' Stormy", malzemeler: ['Rom', 'Zencefil Birası', 'Lime'] },
  { ad: "Mint Julep", malzemeler: ['Viski', 'Nane', 'Şeker Şurubu'] },
  { ad: "Tom Collins", malzemeler: ['Cin', 'Limon', 'Şeker Şurubu', 'Soda'] },
  { ad: "Sex on the Beach", malzemeler: ['Votka', 'Şeftali Likörü', 'Portakal Suyu', 'Kızılcık Suyu'] },
  { ad: "Sea Breeze", malzemeler: ['Votka', 'Kızılcık Suyu', 'Greyfurt'] },
  { ad: "Blue Lagoon", malzemeler: ['Votka', 'Blue Curacao', 'Limon'] },
  { ad: "Pisco Sour", malzemeler: ['Pisco', 'Limon', 'Şeker Şurubu', 'Yumurta Akı'] }, // Yumurta Akı renk yok
  { ad: "Hurricane", malzemeler: ['Rom', 'Portakal Suyu', 'Lime', 'Grenadin'] },
  { ad: "Bellini", malzemeler: ['Şampanya', 'Şeftali Püresi'] },
  { ad: "Gin Fizz", malzemeler: ['Cin', 'Limon', 'Şeker Şurubu', 'Soda'] },
  { ad: "Rusty Nail", malzemeler: ['Viski', 'Drambuie'] },
  { ad: "Boulevardier", malzemeler: ['Viski', 'Campari', 'Vermut'] },
  { ad: "French Martini", malzemeler: ['Votka', 'Chambord', 'Ananas Suyu'] },
  { ad: "Aviation", malzemeler: ['Cin', 'Maraschino Likörü', 'Limon', 'Violet Likörü'] },
  { ad: "Cuba Libre", malzemeler: ['Rom', 'Kola', 'Limon'] },
  { ad: "Sazerac", malzemeler: ['Rye Viski', 'Şeker Şurubu', 'Peychaud’s Bitters', 'Absinthe'] },
  { ad: "Gin Gimlet", malzemeler: ['Cin', 'Lime', 'Şeker Şurubu'] },
  { ad: "Mimosa", malzemeler: ['Şampanya', 'Portakal Suyu'] },
  { ad: "Paloma", malzemeler: ['Tekila', 'Greyfurt', 'Soda', 'Lime'] },
  { ad: "Zombie", malzemeler: ['Rom', 'Kahve Likörü', 'Ananas Suyu', 'Lime', 'Grenadin'] },
  { ad: "Vesper Martini", malzemeler: ['Cin', 'Votka', 'Lillet Blanc'] },
  { ad: "Caipiroska", malzemeler: ['Votka', 'Lime', 'Şeker Şurubu'] },
];

function CocktailMaker() {
  const [aktifTarif, setAktifTarif] = useState(tarifler[0]);
  const [bardak, setBardak] = useState([]);
  const [skor, setSkor] = useState(0);
  const [sure, setSure] = useState(120);
  const [seviye, setSeviye] = useState(1);
  const [mesaj, setMesaj] = useState(null);

  useEffect(() => {
    if (sure === 0) {
      setMesaj('Süre doldu! Oyun yeniden başlatılıyor...');
      const yenidenBaslat = setTimeout(() => {
        setSure(120);
        setSkor(0);
        setSeviye(1);
        setBardak([]);
        setMesaj(null);
        setAktifTarif(tarifler[0]);
      }, 2000);
      return () => clearTimeout(yenidenBaslat);
    }

    const timer = setInterval(() => {
      setSure(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [sure]);

  useEffect(() => {
    if (!mesaj) return;
    const mesajTimer = setTimeout(() => setMesaj(null), 3000);
    return () => clearTimeout(mesajTimer);
  }, [mesaj]);

  const bardagaEkle = (malzeme) => {
    setBardak([...bardak, malzeme]);
  };

  const kontrolEt = () => {
    const isDogru = aktifTarif.malzemeler.length === bardak.length &&
      aktifTarif.malzemeler.every(m => bardak.includes(m));
    
    if (isDogru) {
      setSkor(skor + 1);
      setMesaj(`Tebrikler! ${aktifTarif.ad} kokteyli doğru yapıldı.`);
      setBardak([]);
      if (skor + 1 >= 5) {
        setSeviye(seviye + 1);
        setSkor(0);
        setMesaj(`🎉 Yeni seviyeye geçtiniz! Seviye: ${seviye + 1}`);
      }
      // Yeni tarif seç (seviye ile birlikte karmaşıklık artırılabilir)
      const yeniTarif = tarifler[Math.floor(Math.random() * tarifler.length)];
      setAktifTarif(yeniTarif);
    } else {
      setMesaj('Kokteyl malzemeleri doğru değil, tekrar deneyin!');
    }
  };

  return (
    <div className="cocktail-container">
      <div className="cocktail-header">
        <Link to="/" className="back-button">← Ana Sayfa</Link>
        <h1>🍹 Kokteyl Yapma Oyunu</h1>
        <div></div> {/* Spacing için boş div */}
      </div>

      <div className="cocktail-game">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '16px',
          fontWeight: '600',
          color: '#667eea'
        }}>
          <span>Seviye: {seviye}</span>
          <span>Skor: {skor}</span>
          <span>Süre: {sure}s</span>
        </div>

        <div className="tarif">
          <h3>🍸 Tarif: {aktifTarif.ad}</h3>
          <ul>
            {aktifTarif.malzemeler.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>

      <div className="malzeme-listesi">
        {malzemeler.map((malzeme, i) => (
          <button
            key={i}
            className="malzeme-buton"
            onClick={() => bardagaEkle(malzeme)}
          >
            {malzeme}
          </button>
        ))}
      </div>

        <div className="butonlar-ust">
          <button onClick={() => setBardak(bardak.slice(0, -1))}>Geri Al</button>
          <button onClick={() => setBardak([])}>Temizle</button>
        </div>

        <div className="bardak">
          <div className="bardak-icerik">
            {bardak.map((malzeme, i) => (
              <div
                key={i}
                className="bardak-dolgu"
                style={{ backgroundColor: renkler[malzeme] || '#999' }}
              >
                {malzeme}
              </div>
            ))}
          </div>
        </div>

        {mesaj && <div className="mesaj">{mesaj}</div>}

        <button className="gonder-buton" onClick={kontrolEt}>🍹 Kokteyli Gönder</button>

        {/* Nasıl Oynanır */}
        <div className="instructions">
          <h3>🍸 Nasıl Oynanır</h3>
          <ul>
            <li>🎯 <strong>Amaç:</strong> Verilen tarifleri doğru şekilde yapın</li>
            <li>📋 <strong>Tarif:</strong> Üstte gösterilen malzemeleri kullanın</li>
            <li>🧪 <strong>Ekleme:</strong> Malzeme butonlarına tıklayarak bardağa ekleyin</li>
            <li>↩️ <strong>Geri Al:</strong> Son eklenen malzemeyi çıkarın</li>
            <li>🧽 <strong>Temizle:</strong> Bardağı tamamen boşaltın</li>
            <li>✅ <strong>Gönder:</strong> Kokteyli kontrol ettirin</li>
            <li>⏰ <strong>Süre:</strong> Zamanın dolmadan tarifleri tamamlayın</li>
            <li>📈 <strong>Seviye:</strong> Doğru tariflerle bir sonraki seviyeye geçin</li>
          </ul>
          <p className="tip">
            💡 <strong>İpucu:</strong> Malzeme sırası önemlidir! Tarifte yazılan sırayla ekleyin.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CocktailMaker;
