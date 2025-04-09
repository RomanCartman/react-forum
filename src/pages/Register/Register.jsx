// src/pages/Register/Register.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import styles from './Register.module.css';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await register(email, username, password);
      navigate('/');
    } catch (error) {
      setError('Ошибка при регистрации. Возможно, такой email уже существует.');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Регистрация</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}

export default Register;