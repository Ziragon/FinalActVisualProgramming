import { useState, useEffect, useRef } from 'react';
import { jwtDecode } from "jwt-decode"

export const useAuth = () => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    userId: null,
    username: null,
    roleId: null, // Добавляем поле для роли
    token: null
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuth({
          isAuthenticated: true,
          userId: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
          username: decoded.sub,
          roleId: parseInt(decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']), // Предполагаем, что роль хранится здесь
          token: token
        });
      } catch (e) {
        console.error('Invalid token:', e);
        logout();
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    const decoded = jwtDecode(token);
    setAuth({
      isAuthenticated: true,
      userId: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      username: decoded.sub,
      roleId: parseInt(decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']),
      token: token
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuth({
      isAuthenticated: false,
      userId: null,
      username: null,
      roleId: null,
      token: null
    });
  };

  return { ...auth, login, logout };
};