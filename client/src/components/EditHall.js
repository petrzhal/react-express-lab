import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './EditHall.css'; 

const EditHall = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [hall, setHall] = useState({
    name: '',
    description: '',
    exhibition: '',
    createdAt: '', 
    updatedAt: '' 
  });

  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [exhibitions, setExhibitions] = useState([]); 
  const [validationErrors, setValidationErrors] = useState({}); 
  const token = localStorage.getItem('jwt');
  const isAuthorized = !!token;

  const isEditMode = location.pathname.includes('edit');
  const isAddMode = location.pathname.includes('add');

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/exhibitions`);
        if (!response.ok) {
          throw new Error('Не удалось загрузить выставки');
        }
        const data = await response.json();
        setExhibitions(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchExhibitions();

    if (id && !isAddMode) {
      const fetchHall = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/halls/${id}`);
          if (!response.ok) {
            throw new Error('Не удалось загрузить зал');
          }
          const data = await response.json();
          setHall(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchHall();
    } else {
      setLoading(false);
    }
  }, [id, isAddMode]);

  const validateForm = () => {
    const errors = {};
    if (!hall.name.trim()) {
      errors.name = 'Название зала обязательно для заполнения.';
    }
    if (!hall.description.trim()) {
      errors.description = 'Описание зала обязательно для заполнения.';
    }
    if (!hall.exhibition) {
      errors.exhibition = 'Выбор выставки обязателен.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0; 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return; 
    }

    try {
      const method = id ? 'PUT' : 'POST';
      const url = id
        ? `http://localhost:5000/api/halls/${id}`
        : 'http://localhost:5000/api/halls';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(hall),
      });

      if (!response.ok) {
        throw new Error('Не удалось сохранить зал');
      }

      navigate('/halls');
    } catch (error) {
      setError(error.message);
    }
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

  const formatDateForUser = (date) => {
    const localDate = new Date(date).toLocaleString();
    const utcDate = new Date(date).toISOString();
    return (
      <span>
        <strong>Местное время:</strong> {localDate} <br />
        <strong>UTC:</strong> {utcDate}
      </span>
    );
  };

  return (
    <div className="edit-hall-container">
      <div className="details-header">
        <h2 className='hall-title'>
          {isAddMode ? 'Добавить зал' : id ? `Зал: ${hall.name}` : ''}
          {isEditMode && !isAddMode && ' (Режим редактирования)'}
        </h2>
      </div>

      {(isEditMode || isAddMode) ? (
        <form onSubmit={handleSubmit} className="form">
          <label>
            Название:
            <input
              type="text"
              value={hall.name}
              onChange={(e) => setHall({ ...hall, name: e.target.value })}
              required
            />
            {validationErrors.name && <span className="error">{validationErrors.name}</span>}
          </label>
          <label>
            Описание:
            <textarea
              value={hall.description}
              onChange={(e) => setHall({ ...hall, description: e.target.value })}
              required
            />
            {validationErrors.description && <span className="error">{validationErrors.description}</span>}
          </label>
          <label>
            Выставка:
            <select
              value={hall.exhibition}
              onChange={(e) => setHall({ ...hall, exhibition: e.target.value })}
              required
            >
              <option value="">Выберите выставку</option>
              {exhibitions.map((exhibition) => (
                <option key={exhibition._id} value={exhibition._id}>
                  {exhibition.title}
                </option>
              ))}
            </select>
            {validationErrors.exhibition && <span className="error">{validationErrors.exhibition}</span>}
          </label>
          <button type="submit" className="submit-button">
            {id ? 'Обновить зал' : 'Создать зал'}
          </button>
        </form>
      ) : (
        <div className="details">
          <p><strong>Название:</strong> {hall.name}</p>
          <p><strong>Описание:</strong> {hall.description}</p>
          <p><strong>Выставка:</strong> {hall.exhibition.title}</p>
          <p>
            <strong>Время добавления:</strong> {formatDateForUser(hall.createdAt)}
          </p>
          <p>
            <strong>Время изменения:</strong> {formatDateForUser(hall.updatedAt)}
          </p>
        </div>
      )}
    </div>
  );
};

export default EditHall;
