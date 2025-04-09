import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      console.log('Login successful'); // Добавим для отладки
      navigate('/');
    } catch (error) {
      console.error('Login error:', error); // Добавим для отладки
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Вход в систему</h2>
        
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
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}

export default Login;