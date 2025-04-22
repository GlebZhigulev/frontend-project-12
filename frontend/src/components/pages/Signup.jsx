import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SignupForm from '../forms/SignupForm';
import apiClient from '../../tools/apiClient';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const { t } = useTranslation();
  const { login } = useAuth();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await apiClient.post('/signup', {
        username: values.username,
        password: values.password,
      });
      // логинимся с теми же данными
      login(values, { setSubmitting });
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({ username: t('signup.userExists') });
      } else {
        setErrors({ general: t('errors.default') });
      }
      setSubmitting(false);
    }
  };
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>{t('signup.title')}</h3>
            </div>
            <div className="card-body">
              <SignupForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
