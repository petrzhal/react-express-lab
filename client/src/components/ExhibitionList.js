import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ExhibitionList.css';

const ExhibitionList = () => {
  const [exhibitions, setExhibitions] = useState([]);
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
    const fetchExhibitions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/exhibitions');
        if (!response.ok) {
          throw new Error('Failed to fetch exhibitions');
        }
        const data = await response.json();
        setExhibitions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exhibition?')) {
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`http://localhost:5000/api/exhibitions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete exhibition');
      }

      setExhibitions(exhibitions.filter((exhibition) => exhibition._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredExhibitions = exhibitions.filter((exhibition) =>
    exhibition.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedExhibitions = [...filteredExhibitions].sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    
    if (sortOrder === 'asc') {
      return titleA.localeCompare(titleB);
    } else {
      return titleB.localeCompare(titleA);
    }
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="exhibition-list">
      <h2 className="ex-title">Exhibitions</h2>
      {isAuthenticated && (
        <button
          onClick={() => navigate('/exhibitions/add')}
          className="add-button"
        >
          Add Exhibition
        </button>
      )}
      <div className="search-sort-container">
        <input
          type="text"
          placeholder="Search exhibitions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="asc">Sort by Title (A-Z)</option>
          <option value="desc">Sort by Title (Z-A)</option>
        </select>
      </div>
      <ul className="list">
        {sortedExhibitions.map((exhibition) => (
          <li key={exhibition._id} className="list-item">
            <span className="list-item-title">{exhibition.title}</span>
            <div className="actions">
              <button
                className="btn details"
                onClick={() => navigate(`/exhibitions/${exhibition._id}`)}
              >
                Details
              </button>
              {isAuthenticated && (
                <>
                  <button
                    className="btn edit"
                    onClick={() => navigate(`/exhibitions/edit/${exhibition._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn delete"
                    onClick={() => handleDelete(exhibition._id)}
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

export default ExhibitionList;
