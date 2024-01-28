import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "./App.css";
import { server } from "./server";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)

function App() {
  const [itemName, setItemName] = useState("");
  const [source, setSource] = useState("Amazon");
  const [country, setCountry] = useState("US");
  const [priceHistory, setPriceHistory] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${server}/price-history`, {
        params: {
          itemName,
          country,
          source,
        },
      });
      setPriceHistory(response.data.data);
      console.log(response.data.data, "Response DATA");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const options = {
    plugins:{
      legends:true,
    }
  };


  return (
    <div className="bg-[#EEEEEE] ">
    <div className="container mx-auto p-4">
    <div class=" flex items-center justify-center">
  <h1 class="text-3xl text-[#053B50] font-bold mb-4">Item Price History Graph</h1>
  </div>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Enter item name"
          className="p-2 border border-gray-300"
        />
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="p-2 border border-gray-300"
        >
          <option value="Amazon">Amazon</option>
        </select>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="p-2 border border-gray-300"
        >
          <option value="US">US</option>
        </select>
        <button onClick={handleSearch} className="p-2 rounded-md bg-[#053B50] text-white">
          Search
        </button>
      </div>
      {priceHistory != 0 && (
        <div>
          <h2 className="text-xl text-[#053B50] font-serif mb-2">
            Price History for {itemName} ({source} - {country})
          </h2>
          <Line
            data={{
              labels: priceHistory.map((entry) => entry.createdAt),
              datasets: [
                {
                  label: "Price",
                  data: priceHistory.map((entry) => entry.price),
                  borderColor: "darkblue",
                  fill: false,
                },
              ],
            }}
            options={options}
          />
        </div>
      )}
    </div>
    </div>
  );
}

export default App;
