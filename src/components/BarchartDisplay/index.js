import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const BarchartDisplay = ({ selectedMonth }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedMonth) return;

    const fetchPriceRangeStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:3000/api/price-range-statistics?month=${selectedMonth}`);
        if (!response.ok) throw new Error("Failed to fetch price range statistics");

        const result = await response.json();

        // Formatting data for Recharts
        const formattedData = Object.entries(result).map(([range, count]) => ({
          range,
          count: Number(count) || 0,
        }));

        setData(formattedData);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceRangeStats();
  }, [selectedMonth]);

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Price Range Statistics - {selectedMonth}</h2>

      {loading ? (
        <div className="text-center text-lg">Loading price range statistics...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="range" label={{ value: "Price Range ($)", position: "insideBottom", offset: -5 }} />
            <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Bar dataKey="count" fill="#3498db" /> {/* Updated color to blue */}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-500">No data available</div>
      )}
    </div>
  );
};

export default BarchartDisplay;
