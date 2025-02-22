import React, { useEffect, useState } from "react";

const Statistics = ({ selectedMonth }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedMonth) return;

    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:3000/api/statistics?month=${selectedMonth}`);
        if (!response.ok) throw new Error("Failed to fetch statistics");

        const data = await response.json();
        setStats({
          totalSaleAmount: Number(data.totalSaleAmount) || 0,
          totalSoldItems: Number(data.totalSoldItems) || 0,
          totalNotSoldItems: Number(data.totalNotSoldItems) || 0,
        });
      } catch (err) {
        setError(err.message);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedMonth]);

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        Statistics for {selectedMonth}
      </h2>

      {loading ? (
        <div className="text-center text-lg">Loading statistics...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : stats ? (
        <div className="bg-blue-50 p-6 rounded-lg shadow-lg text-center">
          <div className="bg-yellow-300 p-4 rounded-md inline-block">
            <p className="text-lg font-semibold">
              💰 Total Sales: ${stats.totalSaleAmount.toFixed(2)}
            </p>
            <p className="text-lg font-semibold">✅ Sold Items: {stats.totalSoldItems}</p>
            <p className="text-lg font-semibold">❌ Unsold Items: {stats.totalNotSoldItems}</p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">No statistics available</div>
      )}
    </div>
  );
};

export default Statistics;
