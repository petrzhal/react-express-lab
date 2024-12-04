import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './EditExhibit.css'; 

function EditExhibit () {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [exhibit, setExhibit] = useState({
    name: '',
    description: '',
    year: '',
    hall: '',
    creator: '',
    isActive: true,
    createdAt: '',
    updatedAt: '',
  });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [halls, setHalls] = useState([]); 
  const [yearError, setYearError] = useState(''); 
  const token = localStorage.getItem('jwt');
  const isAuthorized = !!token;

  const isEditMode = location.pathname.includes('edit');
  const isAddMode = location.pathname.includes('add');

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
      }
    };

    fetchHalls();

    if (id && !isAddMode) {
      const fetchExhibit = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/exhibits/${id}`);
          if (!response.ok) {
            throw new Error('Не удалось загрузить экспонат');
          }
          const data = await response.json();
          setExhibit(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchExhibit();
    } else {
      setLoading(false);
    }
  }, [id, isAddMode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const currentYear = new Date().getFullYear();
    if (exhibit.year > currentYear) {
      setYearError('Год не может быть позже текущего года.');
      return;
    } else {
      setYearError('');
    }

    try {
      const method = id ? 'PUT' : 'POST';
      const url = id
        ? `http://localhost:5000/api/exhibits/${id}`
        : 'http://localhost:5000/api/exhibits';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(exhibit),
      });

      if (!response.ok) {
        throw new Error('Не удалось сохранить экспонат');
      }

      navigate('/exhibits');
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Не указано';
    const localDate = new Date(date).toLocaleString();
    const utcDate = new Date(date).toISOString();
    return `${localDate} (местное время), ${utcDate} (UTC)`;
  };

  if (!isAuthorized) {
    return <div className="error">Вы не авторизованы для доступа к этой странице.</div>;
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }
  let title = "";
  if (isAddMode) {
    title = "Add exhibit";
  } else if (isEditMode) {
    title = "Edit exhibit";
  } else {
    title = "Exhibit details";
  }

  return (
    <div className="edit-exhibit-container">
      <h2>{title + ": " + exhibit.name}</h2>
      {(isEditMode || isAddMode) ? (
        <form onSubmit={handleSubmit} className="form">
          <label>
            Название:
            <input
              type="text"
              value={exhibit.name}
              onChange={(e) => setExhibit({ ...exhibit, name: e.target.value })}
              required
            />
          </label>
          <label>
            Описание:
            <textarea
              value={exhibit.description}
              onChange={(e) => setExhibit({ ...exhibit, description: e.target.value })}
            />
          </label>
          <label>
            Год:
            <input
              type="number"
              value={exhibit.year}
              onChange={(e) => setExhibit({ ...exhibit, year: e.target.value })}
              required
            />
            {yearError && <div className="error">{yearError}</div>} 
          </label>
          <label>
            Зал:
            <select
              value={exhibit.hall}
              onChange={(e) => setExhibit({ ...exhibit, hall: e.target.value })}
              required
            >
              <option value="">Выберите зал</option>
              {halls.map((hall) => (
                <option key={hall._id} value={hall._id}>
                  {hall.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Создатель:
            <input
              type="text"
              value={exhibit.creator}
              onChange={(e) => setExhibit({ ...exhibit, creator: e.target.value })}
              required
            />
          </label>
          <label>
            Активно:
            <input
              type="checkbox"
              checked={exhibit.isActive}
              onChange={(e) => setExhibit({ ...exhibit, isActive: e.target.checked })}
            />
          </label>
          <button type="submit" className="submit-button">
            {id ? 'Обновить экспонат' : 'Создать экспонат'}
          </button>
        </form>
      ) : (
        <div className="details">
          <p><strong>Название:</strong> {exhibit.name}</p>
          <p><strong>Описание:</strong> {exhibit.description}</p>
          <p><strong>Год:</strong> {exhibit.year}</p>
          <p><strong>Зал:</strong> {halls.find(hall => hall._id === exhibit.hall)? halls.find(hall => hall._id === exhibit.hall).name : 'Не указано'}</p>
          <p><strong>Создатель:</strong> {exhibit.creator}</p>
          <p><strong>Активно:</strong> {exhibit.isActive ? 'Да' : 'Нет'}</p>
          <p><strong>Дата создания:</strong> {formatDate(exhibit.createdAt)}</p>
          <p><strong>Дата изменения:</strong> {formatDate(exhibit.updatedAt)}</p>
        </div>
      )}
    </div>
  );
};

export default EditExhibit;
