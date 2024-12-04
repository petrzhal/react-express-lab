import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BitcoinPrice.css"; 

const BitcoinPriceComponent = () => {
  const [bitcoinData, setBitcoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://api.coindesk.com/v1/bpi/currentprice.json";

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setBitcoinData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBitcoinData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <h2 className="api-title">Bitcoin Price</h2>
      {bitcoinData && (
        <div className="content">
          <p className="last-updated">
            <strong>Last Updated:</strong> {bitcoinData.time.updated}
          </p>
          <div>
            <h3>Prices:</h3>
            <ul className="price-list">
              {Object.entries(bitcoinData.bpi).map(([currency, details]) => (
                <li key={currency} className="price-item">
                  <strong>{details.code}:</strong> {details.rate} ({details.description})
                </li>
              ))}
            </ul>
          </div>
          <p className="disclaimer">
            <strong>Disclaimer:</strong> {bitcoinData.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
};

export default BitcoinPriceComponent;
