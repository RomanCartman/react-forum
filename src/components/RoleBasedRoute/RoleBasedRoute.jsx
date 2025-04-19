import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { hasRequiredRoles, hasAllPermissions } from '../../utils/roleUtils';
import styles from './RoleBasedRoute.module.css';

const RoleBasedRoute = ({ children, allowedRoles = [], requiredPermissions = [] }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  // Проверяем авторизацию
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Проверяем роли и разрешения
  const hasRole = hasRequiredRoles(user.roles, allowedRoles);
  const hasPermissions = hasAllPermissions(user.permissions, requiredPermissions);

  // Если требуются роли и разрешения, проверяем оба условия
  if (allowedRoles.length && requiredPermissions.length) {
    if (!hasRole || !hasPermissions) {
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
  }
  // Если требуются только роли
  else if (allowedRoles.length && !hasRole) {
    return (
      <div className={styles.accessDenied}>
        <h2>Доступ запрещен</h2>
        <p>Для доступа требуется более высокий уровень привилегий</p>
        <button 
          onClick={() => window.history.back()} 
          className={styles.backButton}
        >
          Вернуться назад
        </button>
      </div>
    );
  }
  // Если требуются только разрешения
  else if (requiredPermissions.length && !hasPermissions) {
    return (
      <div className={styles.accessDenied}>
        <h2>Доступ запрещен</h2>
        <p>У вас отсутствуют необходимые разрешения</p>
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