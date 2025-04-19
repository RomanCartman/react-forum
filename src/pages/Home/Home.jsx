import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { PERMISSIONS, hasPermission } from '../../utils/roleUtils';
import NewsForm from '../../components/NewsForm/NewsForm';
import styles from './Home.module.css';

function Home() {
  const { user, token } = useContext(AuthContext);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [permissions, setPermissions] = useState({
    canCreate: false,
    canUpdateIds: new Set(),
    canDeleteIds: new Set()
  });

  // Загружаем права пользователя
  useEffect(() => {
    const loadPermissions = async () => {
      if (!user) return;

      try {
        const canCreate = await hasPermission(user, PERMISSIONS.CREATE_NEWS, token);
        setPermissions(prev => ({ ...prev, canCreate }));
      } catch (err) {
        console.error('Ошибка при проверке прав создания:', err);
      }
    };

    loadPermissions();
  }, [user, token]);

  // Загружаем права на редактирование и удаление для каждой новости
  useEffect(() => {
    const loadNewsPermissions = async () => {
      if (!user || !news.length) return;

      const updateIds = new Set();
      const deleteIds = new Set();

      for (const newsItem of news) {
        if (newsItem.authorId === user.id) {
          const canUpdate = await hasPermission(user, PERMISSIONS.UPDATE_NEWS, token);
          const canDelete = await hasPermission(user, PERMISSIONS.DELETE_NEWS, token);

          if (canUpdate) updateIds.add(newsItem.id);
          if (canDelete) deleteIds.add(newsItem.id);
        }
      }

      setPermissions(prev => ({
        ...prev,
        canUpdateIds: updateIds,
        canDeleteIds: deleteIds
      }));
    };

    loadNewsPermissions();
  }, [user, token, news]);

  const canUpdateNews = (newsItem) => {
    return permissions.canUpdateIds.has(newsItem.id);
  };

  const canDeleteNews = (newsItem) => {
    return permissions.canDeleteIds.has(newsItem.id);
  };

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:5000/news');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке новостей');
      }
      const data = await response.json();
      setNews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleCreateNews = async (newsData) => {
    try {
      // Проверяем наличие обязательных полей
      if (!newsData.title || !newsData.title.trim()) {
        throw new Error('Заголовок обязателен');
      }
      if (!newsData.content || !newsData.content.trim()) {
        throw new Error('Текст новости обязателен');
      }
      if (!newsData.imageUrl) {
        throw new Error('Изображение обязательно');
      }

      const response = await fetch('http://localhost:5000/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newsData.title.trim(),
          content: newsData.content.trim(),
          images: [newsData.imageUrl]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при создании новости');
      }

      // Обновляем список новостей
      fetchNews();
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteNews = async (newsId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/news/${newsId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении новости');
      }

      // Обновляем список новостей
      fetchNews();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateNews = async (newsData) => {
    try {
      const response = await fetch(`http://localhost:5000/news/${editingNews.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newsData.title,
          content: newsData.content,
          images: newsData.imageUrl ? [newsData.imageUrl] : []
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении новости');
      }

      // Обновляем список новостей
      fetchNews();
      setEditingNews(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (newsItem) => {
    setEditingNews({
      ...newsItem,
      imageUrl: newsItem.images?.[0] || ''
    });
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка новостей...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <section className={styles.welcome}>
        <h1>Добро пожаловать в ЭИОС АнГТУ</h1>
        <p>Электронная информационно-образовательная среда</p>
      </section>

      <section className={styles.newsSection}>
        <div className={styles.newsHeader}>
          <h2>Последние новости</h2>
          {!editingNews && permissions.canCreate && (
            <button 
              className={styles.createButton}
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Отменить' : 'Создать новость'}
            </button>
          )}
        </div>

        {showCreateForm && !editingNews && (
          <NewsForm 
            onSubmit={handleCreateNews}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {editingNews && (
          <div className={styles.editForm}>
            <h3>Редактирование новости</h3>
            <NewsForm 
              initialData={editingNews}
              onSubmit={handleUpdateNews}
              onCancel={() => setEditingNews(null)}
            />
          </div>
        )}

        <div className={styles.newsGrid}>
          {news.map((newsItem) => (
            <article key={newsItem.id} className={styles.newsCard}>
              {newsItem.images && newsItem.images.length > 0 && (
                <div className={styles.newsImage}>
                  <img src={newsItem.images[0]} alt={newsItem.title} />
                </div>
              )}
              <div className={styles.newsContent}>
                <h3>{newsItem.title}</h3>
                <p>{newsItem.content}</p>
                <div className={styles.newsFooter}>
                  <div className={styles.author}>
                    <span>Автор: {newsItem.author.firstName} {newsItem.author.lastName}</span>
                  </div>
                  <div className={styles.date}>
                    {new Date(newsItem.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                {(canUpdateNews(newsItem) || canDeleteNews(newsItem)) && (
                  <div className={styles.newsActions}>
                    {canUpdateNews(newsItem) && (
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEditClick(newsItem)}
                      >
                        Редактировать
                      </button>
                    )}
                    {canDeleteNews(newsItem) && (
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDeleteNews(newsItem.id)}
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;