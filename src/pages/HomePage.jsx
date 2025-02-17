import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Coins } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const API_URL = (page) => 
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=${page}&sparkline=false`;

async function fetchTopCoins(page) {
  try {
    const response = await fetch(API_URL(page));
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error fetching top coins:", error);
    return [];
  }
}

function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="logo flex items-center gap-2 text-2xl font-bold">
        <Coins className="text-blue-400" /> CRYPTOFOLIO
      </h1>
      <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Watch List</button>
    </header>
  );
}

function CoinCarousel({ coins }) {
  return (
    <Swiper 
      slidesPerView={4} 
      loop 
      autoplay={{ delay: 1500 }} 
      modules={[Autoplay]} 
      className="coin-carousel my-8"
    >
      {coins.map((coin) => (
        <SwiperSlide key={coin.id}>
          <div className="coin-slide p-4 text-center">
            <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-12 h-12 mx-auto" />
            <p className="mt-2 font-medium">{coin.name}</p>
            <p className="text-gray-600">${coin.current_price?.toLocaleString()}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function CoinTable({ coins, loading, onCoinClick }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-4 text-left">Coin</th>
          <th className="p-4 text-left">Price</th>
          <th className="p-4 text-left">24h Change</th>
          <th className="p-4 text-left">Market Cap</th>
        </tr>
      </thead>
      <tbody>
        {coins.map((coin) => (
          <tr 
            key={coin.id} 
            onClick={() => onCoinClick(coin.id)}
            className="border-b hover:bg-gray-50 cursor-pointer"
          >
            <td className="p-4 flex items-center gap-3">
              <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-8 h-8" />
              <div>
                <span className="font-medium">{coin.name}</span>
                <span className="text-gray-500 ml-2">{coin.symbol.toUpperCase()}</span>
              </div>
            </td>
            <td className="p-4">${coin.current_price?.toLocaleString()}</td>
            <td className={`p-4 ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {coin.price_change_percentage_24h?.toFixed(2)}%
            </td>
            <td className="p-4">${coin.market_cap?.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function HomePage() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCoins = async () => {
      setLoading(true);
      try {
        const data = await fetchTopCoins(page);
        setCoins(data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    loadCoins();
  }, [page]);

  const handleCoinClick = (coinId) => {
    navigate(`/coin/${coinId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">CRYPTOFOLIO WATCH LIST</h1>
          <p className="text-gray-600 mb-8">Get all the info on your favorite cryptocurrencies</p>
          <CoinCarousel coins={coins} />
        </section>
        <main>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Top Cryptocurrencies</h2>
          </div>
          <CoinTable coins={coins} loading={loading} onCoinClick={handleCoinClick} />
          <div className="flex justify-center gap-4 mt-8">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              disabled={page === 1} 
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <span className="py-2">Page {page}</span>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}