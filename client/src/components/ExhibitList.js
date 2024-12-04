import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ExhibitList.css';

const ExhibitList = () => {
  const [exhibits, setExhibits] = useState([]);
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
    const fetchExhibits = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/exhibits');
        if (!response.ok) {
          throw new Error('Failed to fetch exhibits');
        }
        const data = await response.json();
        setExhibits(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibits();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exhibit?')) {
      return;
    }

    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`http://localhost:5000/api/exhibits/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete exhibit');
      }

      setExhibits(exhibits.filter((exhibit) => exhibit._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredExhibits = exhibits.filter((exhibit) =>
    exhibit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedExhibits = [...filteredExhibits].sort((a, b) => {
    const titleA = a.name.toLowerCase();
    const titleB = b.name.toLowerCase();
    
    return sortOrder === 'asc'
      ? titleA.localeCompare(titleB)
      : titleB.localeCompare(titleA);
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="exhibit-list">
      <h2 className="list-item-title">Exhibits</h2>
      {isAuthenticated && (
        <button
          onClick={() => navigate('/exhibits/add')}
          className="add-button"
        >
          Add Exhibit
        </button>
      )}
      <div className="search-sort-container">
        <input
          type="text"
          placeholder="Search exhibits..."
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
        {sortedExhibits.map((exhibit) => (
          <li key={exhibit._id} className="list-item">
            <span className="list-item-title">
            <span className="list-item-title">{exhibit.name}</span>
            </span>
            <div className="actions">
              <button
                className="btn details"
                onClick={() => navigate(`/exhibits/${exhibit._id}`)}
              >
                Details
              </button>
              {isAuthenticated && (
                <>
                  <button
                    className="btn edit"
                    onClick={() => navigate(`/exhibits/edit/${exhibit._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn delete"
                    onClick={() => handleDelete(exhibit._id)}
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

export default ExhibitList;
