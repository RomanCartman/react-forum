import React, { useState } from 'react';
import styles from './NewsForm.module.css';

const NewsForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    imageUrl: initialData?.imageUrl || '',
    content: initialData?.content || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Заголовок</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Введите заголовок новости"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="imageUrl">URL изображения</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Вставьте URL изображения"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content">Содержание</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Введите текст новости"
          rows="6"
          required
        />
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className={styles.submitButton}>
          {initialData ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  );
};

export default NewsForm; 