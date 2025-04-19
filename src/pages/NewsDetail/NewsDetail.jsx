import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { PERMISSIONS, hasPermission } from '../../utils/roleUtils';
import NewsForm from '../../components/NewsForm/NewsForm';
import styles from './NewsDetail.module.css';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [permissions, setPermissions] = useState({
    canUpdate: false,
    canDelete: false
  });

  useEffect(() => {
    const loadPermissions = async () => {
      if (!user || !news) return;

      try {
        const canUpdate = await hasPermission(user, PERMISSIONS.UPDATE_NEWS, token) && 
                         news.author?.id === user.id;
        const canDelete = await hasPermission(user, PERMISSIONS.DELETE_NEWS, token) && 
                         news.author?.id === user.id;
        
        setPermissions({ canUpdate, canDelete });
      } catch (err) {
        console.error('Ошибка при проверке прав:', err);
      }
    };

    loadPermissions();
  }, [user, token, news]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/news/${id}`);
        if (!response.ok) {
          throw new Error('Новость не найдена');
        }
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  const handleUpdateNews = async (newsData) => {
    try {
      const response = await fetch(`http://localhost:5000/news/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newsData.title,
          content: newsData.content,
          images: newsData.imageUrl ? [newsData.imageUrl] : news.images
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении новости');
      }

      const updatedNews = await response.json();
      setNews(updatedNews);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteNews = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении новости');
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!news) {
    return <div className={styles.error}>Новость не найдена</div>;
  }

  if (isEditing) {
    return (
      <div className={styles.newsDetail}>
        <button 
          className={styles.backButton} 
          onClick={() => setIsEditing(false)}
          aria-label="Отменить редактирование"
        >
          ← Отменить
        </button>
        <div className={styles.editForm}>
          <h2>Редактирование новости</h2>
          <NewsForm 
            initialData={{
              ...news,
              imageUrl: news.images?.[0] || ''
            }}
            onSubmit={handleUpdateNews}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.newsDetail}>
      <button 
        className={styles.backButton} 
        onClick={() => navigate(-1)}
        aria-label="Вернуться назад"
      >
        ← Назад
      </button>
      <article className={styles.article}>
        <h1 className={styles.title}>{news.title}</h1>
        {news.images && news.images[0] && (
          <img 
            src={news.images[0]} 
            alt={news.title} 
            className={styles.image}
          />
        )}
        <div className={styles.content}>{news.content}</div>
        <div className={styles.meta}>
          <span className={styles.author}>
            Автор: {news.author?.firstName} {news.author?.lastName}
          </span>
          <time dateTime={news.createdAt}>
            {new Date(news.createdAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </time>
        </div>
        {(permissions.canUpdate || permissions.canDelete) && (
          <div className={styles.actions}>
            {permissions.canUpdate && (
              <button 
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                Редактировать
              </button>
            )}
            {permissions.canDelete && (
              <button 
                className={styles.deleteButton}
                onClick={handleDeleteNews}
              >
                Удалить
              </button>
            )}
          </div>
        )}
      </article>
    </div>
  );
};

export default NewsDetail; 