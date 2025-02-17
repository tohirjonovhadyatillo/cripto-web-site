import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Coins } from "lucide-react";
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";




ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const COIN_API_URL = (id) => `https://api.coingecko.com/api/v3/coins/${id}`;






function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link to="/" className="logo flex items-center gap-2 text-2xl font-bold">
        <Coins className="text-blue-400" /> CRYPTOFOLIO
      </Link>
      <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Watch List</button>
    </header>
  );
}

export default function CoinDetails() {





  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {


    const fetchCoinDetails = async () => {
      try {
        const response = await fetch(COIN_API_URL(id));
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCoin(data);
        



        const chartResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30`);
        const chartData = await chartResponse.json();
        
        const chartLabels = chartData.prices.map(price => {
          const date = new Date(price[0]);
          return `${date.getDate()}/${date.getMonth() + 1}`;
        });

        const chartPrices = chartData.prices.map(price => price[1]);




        setChartData({
          labels: chartLabels,
          datasets: [{
            label: 'Price in USD',
            data: chartPrices,
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.2)',
            fill: true,
            tension: 0.3,
          }]
        });
        



      } catch (error) {
        console.error("Error fetching coin details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetails();
  }, [id]);




  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }



  if (!coin) {
    return (
      <div className="min-h-screen bg-gray-50">



        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Coin not found</h2>
            <Link to="/" className="text-blue-500 hover:text-blue-600 mt-4 inline-block">
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }






  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-8">
          <ArrowLeft size={20} />
          Back to List
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4 mb-6">
              <img src={coin.image.large} alt={coin.name} className="w-16 h-16" />
              <div>
                <h1 className="text-3xl font-bold">{coin.name}</h1>
                <p className="text-gray-500">{coin.symbol.toUpperCase()}</p>
              </div>
            </div>
            





            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-500">Market Cap Rank</p>
                <p className="text-xl font-bold">#{coin.market_cap_rank}</p>
              </div>




              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-500">Current Price</p>
                <p className="text-xl font-bold">
                  ${coin.market_data.current_price.usd.toLocaleString()}
                </p>



              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-500">24h Change</p>
                <p className={`text-xl font-bold ${
                  coin.market_data.price_change_percentage_24h > 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>



              
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-500">Market Cap</p>
                <p className="text-xl font-bold">
                  ${coin.market_data.market_cap.usd.toLocaleString()}
                </p>
              </div>
            </div>
          </div>



          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Price History (Last 30 Days)</h2>
            {chartData && (
              <Line data={chartData} options={{ responsive: true }} />
            )}
          </div>




          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-500">Total Volume</p>
                <p className="text-xl font-bold">
                  ${coin.market_data.total_volume.usd.toLocaleString()}
                </p>
              </div>


              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-500">24h High</p>
                <p className="text-xl font-bold text-green-500">
                  ${coin.market_data.high_24h.usd.toLocaleString()}
                </p>
              </div>




              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-500">24h Low</p>
                <p className="text-xl font-bold text-red-500">
                  ${coin.market_data.low_24h.usd.toLocaleString()}
                </p>
              </div>



              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-500">Circulating Supply</p>
                <p className="text-xl font-bold">
                  {coin.market_data.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
