import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HallList.css'; 

const HallList = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [sortOrder, setSortOrder] = useState('asc'); 
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('jwt'); 
      setIsAuthenticated(!!token); 
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/halls');
        if (!response.ok) {
          throw new Error('Не удалось загрузить залы');
        }
        const data = await response.json();
        setHalls(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHalls();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hall?')) {
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`http://localhost:5000/api/halls/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete hall');
      }

      setHalls(halls.filter((hall) => hall._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredHalls = halls.filter((hall) =>
    hall.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedHalls = [...filteredHalls].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (sortOrder === 'asc') {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="hall-list">
      <h2 className="hall-list-title">Hall List</h2>
      {isAuthenticated && (
        <button
          onClick={() => navigate('/halls/add')}
          className="add-button"
        >
          Add Hall
        </button>
      )}
      <div className="search-sort-container">
        <input
          type="text"
          placeholder="Search halls..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="asc">Sort by name (A-Z)</option>
          <option value="desc">Sort by name (Z-A)</option>
        </select>
      </div>
      <ul className="list">
        {sortedHalls.map((hall) => (
          <li key={hall._id} className="list-item">
            <span className="list-item-title">{hall.name}</span>
            <div className="actions">
              <button
                className="btn details"
                onClick={() => navigate(`/halls/${hall._id}`)}
              >
                Details
              </button>
              {isAuthenticated && (
                <>
                  <button
                    className="btn edit"
                    onClick={() => navigate(`/halls/edit/${hall._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn delete"
                    onClick={() => handleDelete(hall._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HallList;
