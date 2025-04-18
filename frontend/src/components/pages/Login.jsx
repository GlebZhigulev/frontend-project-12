import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../tools/apiClient';
import { useTranslation } from 'react-i18next';
import { setToken, setError, setUsername } from '../slices/authSlice';
import LoginForm from '../forms/LoginForm';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await apiClient.post('/login', values);
      const { token, username } = response.data;
      dispatch(setToken(token));
      dispatch(setUsername(username));
      navigate('/');
    } catch {
      dispatch(setError(t('login.invalidCredentials')));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>{t('login.title')}</h3>
            </div>
            <div className="card-body">
              <LoginForm onSubmit={handleSubmit} error={error} />
              <div className="mt-3">
                <p>
                  {t('login.noAccount')}
                  <Link to="/signup">{t('login.signupLink')}</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
