import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';

function App() {
  // Проверяем, есть ли пользователь в памяти браузера
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('user'));

  const handleLogin = (username) => {
    localStorage.setItem('user', username);
    setIsAuth(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuth(false);
  };

  return (
      <Router>
        <Routes>
          {/* Если НЕ авторизован — показываем логин, если авторизован — перекидываем на главную */}
          <Route path="/" element={
            !isAuth ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/main" />
          } />

          {/* Если авторизован — показываем главную, если нет — на логин */}
          <Route path="/main" element={
            isAuth ? <MainPage onLogout={handleLogout} /> : <Navigate to="/" />
          } />
        </Routes>
        </Router>
  );
}

export default App;