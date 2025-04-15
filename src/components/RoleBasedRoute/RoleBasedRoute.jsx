import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { hasRequiredRole } from '../../utils/roleUtils';
import styles from './RoleBasedRoute.module.css';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  // Проверяем авторизацию
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Проверяем роль
  if (!hasRequiredRole(user.role, allowedRoles)) {
    return (
      <div className={styles.accessDenied}>
        <h2>Доступ запрещен</h2>
        <p>У вас недостаточно прав для просмотра этой страницы</p>
        <button 
          onClick={() => window.history.back()} 
          className={styles.backButton}
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  return children;
};

export default RoleBasedRoute; 