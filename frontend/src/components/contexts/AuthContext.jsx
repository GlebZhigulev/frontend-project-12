import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../tools/apiClient';
import routes from '../../tools/routes';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) localStorage.removeItem('token');
  }, [token]);

  const login = async (values, { setSubmitting, setErrors }) => {
    try {
      const { data } = await apiClient.post('/login', values);
      setToken(data.token);
      setUsername(data.username);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      navigate(routes.root);
    } catch {
      setError('Неверные учетные данные');
      setErrors?.({ general: 'Неверные учетные данные' });
    } finally {
      setSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    navigate(routes.login);
  };

  return (
    <AuthContext.Provider value={{
      token, username, error, login, logout,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
