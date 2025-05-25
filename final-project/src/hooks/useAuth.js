import { useState, useEffect, useRef } from 'react';
import { jwtDecode } from "jwt-decode"

export const useAuth = () => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    userId: null,
    username: null,
    token: null
  });

  // Проверка токена при монтировании
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuth({
          isAuthenticated: true,
          userId: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
          username: decoded.sub,
          token: token
        });
      } catch (e) {
        console.error('Invalid token:', e);
        logout();
      }
    }
  }, []);

  // Функция логина
  const login = (token) => {
    localStorage.setItem('authToken', token);
    const decoded = jwtDecode(token);
    setAuth({
      isAuthenticated: true,
      userId: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      username: decoded.sub,
      token: token
    });
    console.log(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
  };

  // Функция логаута
  const logout = () => {
    localStorage.removeItem('authToken');
    setAuth({
      isAuthenticated: false,
      userId: null,
      username: null,
      token: null
    });
  };

  return { ...auth, login, logout };
};