// src/components/ProtectedRoute/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import styles from './ProtectedRoute.module.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!user) {
    return (
      <div className={styles.authRequired}>
        <div className={styles.message}>
          <h2>Вам необходимо авторизироваться</h2>
          <div className={styles.buttons}>
            <Link to="/login" state={{ from: location }} className={styles.loginButton}>
              Войти
            </Link>
          </div>
          <div className={styles.registerSection}>
            <span>Нет учетной записи?</span>
            <Link to="/register" className={styles.registerButton}>
              Регистрация
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;