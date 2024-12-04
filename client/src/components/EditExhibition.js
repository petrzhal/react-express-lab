import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './EditExhibition.css';

const EditExhibition = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [exhibition, setExhibition] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    isActive: true,
    createdAt: '',
    updatedAt: '',
  });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('jwt');
  const isAuthorized = !!token;

  const isEditMode = location.pathname.includes('edit');
  const isAddMode = location.pathname.includes('add');

  useEffect(() => {
    if (id && !isAddMode) {
      const fetchExhibition = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/exhibitions/${id}`);
          if (!response.ok) {
            throw new Error('Не удалось загрузить выставку');
          }
          const data = await response.json();
          setExhibition(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchExhibition();
    } else {
      setLoading(false);
    }
  }, [id, isAddMode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const today = new Date();
    const startDate = new Date(exhibition.startDate);
    const endDate = new Date(exhibition.endDate);

    if (startDate > today) {
      setError('Дата начала не может быть в будущем.');
      return;
    }

    if (endDate && startDate > endDate) {
      setError('Дата начала не может быть позже даты окончания.');
      return;
    }

    try {
      const method = id ? 'PUT' : 'POST';
      const url = id
        ? `http://localhost:5000/api/exhibitions/${id}`
        : 'http://localhost:5000/api/exhibitions';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(exhibition),
      });

      if (!response.ok) {
        throw new Error('Не удалось сохранить выставку');
      }

      navigate('/exhibitions');
    } catch (error) {
      setError(error.message);
    }
  };

  if (!isAuthorized && (isAddMode || isEditMode)) {
    return <div className="error">Вы не авторизованы для доступа к этой странице.</div>;
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  const formatDateTime = (date, options) =>
    new Date(date).toLocaleString(undefined, options);

  return (
    <div className="edit-exhibition-container">
      <div className="details-header">
        <h2 className="title">
          {isAddMode ? 'Добавить выставку' : id ? `Выставка: ${exhibition.title}` : ''}
          {isEditMode && !isAddMode && ' (Режим редактирования)'}
        </h2>
      </div>

      {(isEditMode || isAddMode) ? (
        <form onSubmit={handleSubmit} className="form">
          <label>
            Название:
            <input
              type="text"
              value={exhibition.title}
              onChange={(e) => setExhibition({ ...exhibition, title: e.target.value })}
              required
            />
          </label>
          <label>
            Описание:
            <textarea
              value={exhibition.description}
              onChange={(e) => setExhibition({ ...exhibition, description: e.target.value })}
            />
          </label>
          <label>
            Дата начала:
            <input
              type="date"
              value={exhibition.startDate}
              onChange={(e) => setExhibition({ ...exhibition, startDate: e.target.value })}
              required
            />
          </label>
          <label>
            Дата окончания:
            <input
              type="date"
              value={exhibition.endDate}
              onChange={(e) => setExhibition({ ...exhibition, endDate: e.target.value })}
            />
          </label>
          <label>
            Активно:
            <input
              type="checkbox"
              checked={exhibition.isActive}
              onChange={(e) => setExhibition({ ...exhibition, isActive: e.target.checked })}
            />
          </label>
          <button type="submit" className="submit-button">
            {id ? 'Обновить выставку' : 'Создать выставку'}
          </button>
        </form>
      ) : (
        <div className="details">
          <p><strong>Название:</strong> {exhibition.title}</p>
          <p><strong>Описание:</strong> {exhibition.description}</p>
          <p><strong>Дата начала:</strong> {new Date(exhibition.startDate).toLocaleDateString()}</p>
          <p><strong>Дата окончания:</strong> {new Date(exhibition.endDate).toLocaleDateString()}</p>
          <p><strong>Активно:</strong> {exhibition.isActive ? 'Да' : 'Нет'}</p>
          <p><strong>Дата добавления (локальная):</strong> {formatDateTime(exhibition.createdAt)}</p>
          <p><strong>Дата добавления (UTC):</strong> {new Date(exhibition.createdAt).toISOString()}</p>
          <p><strong>Дата изменения (локальная):</strong> {formatDateTime(exhibition.updatedAt)}</p>
          <p><strong>Дата изменения (UTC):</strong> {new Date(exhibition.updatedAt).toISOString()}</p>
        </div>
      )}
    </div>
  );
};

export default EditExhibition;
