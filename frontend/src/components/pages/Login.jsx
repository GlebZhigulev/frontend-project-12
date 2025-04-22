import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginForm from '../forms/LoginForm';
import routes from '../../tools/routes';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const { login, error } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = (values, formikHelpers) => {
    login(values, formikHelpers);
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
                  <Link to={routes.signup}>{t('login.signupLink')}</Link>
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
