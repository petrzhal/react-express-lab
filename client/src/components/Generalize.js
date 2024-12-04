import React, { useState } from "react";

const GenderizeComponent = () => {
  const [name, setName] = useState("Petr");
  const [genderData, setGenderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = `https://api.genderize.io/?name=${name}`; 

  const fetchGenderData = async () => {
    setLoading(true);
    setError(null); 
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setGenderData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchGenderData(); 
  };

  return (
    <div style={styles.container}>
      <h2>Genderize API</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Get Gender</button>
      </form>
      {loading && <div style={styles.loading}>Loading...</div>}
      {error && <div style={styles.error}>Error: {error}</div>}
      {genderData && (
        <div style={styles.result}>
          <h3>Result for: {genderData.name}</h3>
          <p><strong>Gender:</strong> {genderData.gender}</p>
          <p><strong>Probability:</strong> {genderData.probability}</p>
          <p><strong>Count:</strong> {genderData.count}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px", // Устанавливаем максимальную ширину
    margin: "20px auto", // Центрируем контейнер
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#45a049",
  },
  loading: {
    color: "#007BFF",
  },
  error: {
    color: "red",
  },
  result: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #4CAF50",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
  },
};

export default GenderizeComponent;
