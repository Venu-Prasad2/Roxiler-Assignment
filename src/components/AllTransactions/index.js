import React, { useEffect, useState } from "react";
import "./index.css"; // Import the CSS file

const monthMap = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

const AllTransactions = ({ selectedMonth, onMonthChange }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const monthNumber = monthMap[selectedMonth] || "03";
        const response = await fetch(`http://localhost:3000/api/products?month=${monthNumber}&page=${currentPage}`);
        if (!response.ok) throw new Error("Failed to fetch transactions");

        const data = await response.json();
        setTransactions(data.products || []);
        setFilteredTransactions(data.products || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedMonth, currentPage]);

  useEffect(() => {
    const filtered = transactions.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTransactions(filtered);
  }, [searchQuery, transactions]);

  return (
    <div className="transactions-container">
      <h2 className="transactions-header">All Transactions</h2>

      <div className="transactions-controls">
        <select value={selectedMonth} onChange={(e) => onMonthChange(e.target.value)} className="month-select">
          {Object.keys(monthMap).map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      <input
        type="text"
        placeholder="Search by title or category..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <div className="table-container">
        {loading ? (
          <div className="loading-text">Loading transactions...</div>
        ) : error ? (
          <div className="error-text">{error}</div>
        ) : filteredTransactions.length > 0 ? (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Sold</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.category}</td>
                  <td>{item.sold ? "Yes" : "No"}</td>
                  <td><img src={item.image} alt={item.title} className="transaction-image" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data-text">No transactions found</div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 text-gray-700 font-semibold">
        <button
          className={`px-4 py-2 mx-2 rounded-md ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200"}`}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button
          className={`px-4 py-2 mx-2 rounded-md ${currentPage >= totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200"}`}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllTransactions;
