// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

const API_URL = 'http://localhost:5000'; // Убедитесь, что это правильный URL вашего бэкенда

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Функция для получения данных пользователя
  const fetchUserData = async (token, username) => {
    try {
      const response = await fetch(`${API_URL}/auth/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Ошибка авторизации');
      }

      const data = await response.json();
      console.log('Login response:', data); // Для отладки

      // Сохраняем токен
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('username', data.username);
      setToken(data.accessToken);

      // Получаем данные пользователя
      const userData = await fetchUserData(data.accessToken, data.username);
      if (!userData) {
        throw new Error('Не удалось получить данные пользователя');
      }

      return { ...data, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email, password, firstName, lastName, username) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName, username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка регистрации');
      }

      const data = await response.json();
      console.log('Register response:', data);

      // После успешной регистрации автоматически логиним пользователя
      return await login(email, password);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // При загрузке приложения проверяем токен и получаем данные пользователя
  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUsername = localStorage.getItem('username');

      if (savedToken && savedUsername) {
        const userData = await fetchUserData(savedToken, savedUsername);
        if (!userData) {
          logout(); // Если не удалось получить данные пользователя, выходим
        }
      }
      setLoading(false);
    };

    init();
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user // Явно вычисляем isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};