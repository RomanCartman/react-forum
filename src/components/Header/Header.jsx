import React from 'react';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    {/* Логотип */}
                    <div className={styles.logo}>
                        <a href="/" className={styles.logoLink}>
                            <div className={styles.logoPlaceholder}>
                                <img src="https://angtu.ru/upload/medialibrary/1c0/1c0246c3244a933a3ec17462a12d1ee9.png" alt="АГТУ лого" style={{ width: '60px', height: 'auto' }} />
                            </div>
                            <span className={styles.logoText}>ЭИОС АнГТУ</span>
                        </a>
                    </div>

                    {/* Навигация */}
                    <nav className={styles.nav}>
                        <a href="/courses" className={styles.navLink}>
                            Курсы
                        </a>
                        <a href="/schedule" className={styles.navLink}>
                            Расписание
                        </a>
                        <a href="/news" className={styles.navLink}>
                            Новости
                        </a>
                        
                    </nav>

                    {/* Кнопки авторизации */}
                    <div className={styles.auth}>
                        <a href="/login" className={styles.loginBtn}>
                            Вход
                        </a>
                        <a href="/register" className={styles.registerBtn}>
                            Регистрация
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

