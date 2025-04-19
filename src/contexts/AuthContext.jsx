// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

const API_URL = 'http://localhost:5000'; // Убедитесь, что это правильный URL вашего бэкенда

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      setToken(null);
      setUser(null);
    }
  }, [token]);

  const refreshAccessToken = useCallback(async () => {
    const currentRefreshToken = localStorage.getItem('refreshToken');
    if (!currentRefreshToken) {
      throw new Error('Отсутствует refresh token');
    }

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: currentRefreshToken }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Если refresh token недействителен, выходим из системы
          await logout();
          throw new Error('Сессия истекла, требуется повторный вход');
        }
        throw new Error('Не удалось обновить токен');
      }

      const { accessToken, refreshToken: newRefreshToken } = await response.json();
      
      // Сразу обновляем оба токена
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setToken(accessToken);
      
      return accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      throw error;
    }
  }, [logout]);

  const fetchUserProfile = useCallback(async (username, accessToken = token) => {
    try {
      const response = await fetch(`${API_URL}/auth/${username}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            return fetchUserProfile(username, newToken);
          }
        }
        throw new Error('Не удалось получить данные пользователя');
      }
      
      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, [token, refreshAccessToken]);

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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка авторизации');
      }

      const { accessToken, refreshToken: newRefreshToken, username } = await response.json();
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('username', username);
      
      setToken(accessToken);

      const userData = await fetchUserProfile(username, accessToken);
      if (!userData) {
        throw new Error('Не удалось получить данные пользователя');
      }

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (registerData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка регистрации');
      }

      return await login(registerData.email, registerData.password);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('accessToken');
      const savedRefreshToken = localStorage.getItem('refreshToken');
      const savedUsername = localStorage.getItem('username');

      if (savedToken && savedRefreshToken && savedUsername) {
        try {
          const userData = await fetchUserProfile(savedUsername, savedToken);
          if (!userData) {
            const newToken = await refreshAccessToken();
            if (newToken) {
              await fetchUserProfile(savedUsername, newToken);
            }
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          await logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [fetchUserProfile, refreshAccessToken, logout]);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshAccessToken,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};