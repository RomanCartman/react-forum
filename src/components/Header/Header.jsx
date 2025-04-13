import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import styles from './Header.module.css';

const Header = () => {
    const { user, logout, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    console.log('Auth state:', { user, isAuthenticated }); // Добавим для отладки

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    {/* Логотип */}
                    <div className={styles.logo}>
                        <Link to="/" className={styles.logoLink}>
                            <div className={styles.logoPlaceholder}>
                                <img 
                                    src="https://angtu.ru/upload/medialibrary/1c0/1c0246c3244a933a3ec17462a12d1ee9.png" 
                                    alt="АГТУ лого" 
                                    style={{ width: '60px', height: 'auto' }} 
                                />
                            </div>
                            <span className={styles.logoText}>ЭИОС АнГТУ</span>
                        </Link>
                    </div>

                    {/* Навигация */}
                    <nav className={styles.nav}>
                        <Link to="/courses" className={styles.navLink}>
                            Курсы
                        </Link>
                        <Link to="/schedule" className={styles.navLink}>
                            Расписание
                        </Link>
                        <Link to="/news" className={styles.navLink}>
                            Новости
                        </Link>
                    </nav>

                    {/* Кнопки авторизации или информация о пользователе */}
                    <div className={styles.auth}>
                        {isAuthenticated ? (
                            <div className={styles.userSection}>
                                <Link to="/profile" className={styles.userInfo}>
                                    <span className={styles.username}>
                                        {`${user?.firstName} ${user?.lastName}` || user?.email}
                                    </span>
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className={styles.logoutBtn}
                                >
                                    Выход
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className={styles.loginBtn}>
                                    Вход
                                </Link>
                                <Link to="/register" className={styles.registerBtn}>
                                    Регистрация
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;