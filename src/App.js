// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ROLES } from './utils/roleUtils';
import './App.css';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Courses from './pages/Courses/Courses';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute/RoleBasedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Header />
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Доступ для всех авторизованных пользователей */}
              <Route path="/courses" element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              } />
              
              {/* Доступ только для преподавателей и администраторов */}
              <Route path="/course-management" element={
                <RoleBasedRoute allowedRoles={[ROLES.TEACHER, ROLES.ADMINISTRATOR]}>
                  <div>Управление курсами</div>
                </RoleBasedRoute>
              } />
              
              {/* Доступ только для администраторов */}
              <Route path="/admin" element={
                <RoleBasedRoute allowedRoles={[ROLES.ADMINISTRATOR]}>
                  <div>Админ панель</div>
                </RoleBasedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;