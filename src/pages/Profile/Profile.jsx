import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import styles from './Profile.module.css';

const Profile = () => {
  const { token, user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/auth/${user.username}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка загрузки профиля');
        }

        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && user?.username) {
      fetchProfile();
    }
  }, [token, user?.username]);

  if (loading) {
    return <div className={styles.loading}>Загрузка профиля...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <h1>Профиль пользователя</h1>
        
        <div className={styles.profileInfo}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Имя:</span>
            <span className={styles.value}>{profileData?.firstName || 'Не указано'}</span>
          </div>
          
          <div className={styles.infoRow}>
            <span className={styles.label}>Фамилия:</span>
            <span className={styles.value}>{profileData?.lastName || 'Не указано'}</span>
          </div>
          
          <div className={styles.infoRow}>
            <span className={styles.label}>Username:</span>
            <span className={styles.value}>{profileData?.username}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{profileData?.email}</span>
          </div>
          
          <div className={styles.infoRow}>
            <span className={styles.label}>Группа:</span>
            <span className={styles.value}>{profileData?.studentGroup || 'Не указана'}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Роли:</span>
            <div className={styles.rolesList}>
              {profileData?.roles.map(role => (
                <span key={role.id} className={styles.roleTag}>
                  {role.name}
                  <span className={styles.roleDescription}>{role.description}</span>
                </span>
              ))}
            </div>
          </div>

          {profileData?.permissions?.length > 0 && (
            <div className={styles.infoRow}>
              <span className={styles.label}>Права:</span>
              <div className={styles.permissionsList}>
                {profileData.permissions.map(permission => (
                  <span key={permission.id} className={styles.permissionTag}>
                    {permission.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className={styles.infoRow}>
            <span className={styles.label}>Дата регистрации:</span>
            <span className={styles.value}>
              {new Date(profileData?.createdAt).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 