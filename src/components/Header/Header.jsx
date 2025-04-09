import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    {/* Логотип */}
                    <div className={styles.logo}>
                        <Link to="/" className={styles.logoLink}>
                            <div className={styles.logoPlaceholder}>
                                <img src="https://angtu.ru/upload/medialibrary/1c0/1c0246c3244a933a3ec17462a12d1ee9.png" alt="АГТУ лого" style={{ width: '60px', height: 'auto' }} />
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

                    {/* Кнопки авторизации */}
                    <div className={styles.auth}>
                        <Link to="/login" className={styles.loginBtn}>
                            Вход
                        </Link>
                        <Link to="/register" className={styles.registerBtn}>
                            Регистрация
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;