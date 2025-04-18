import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import apiClient from '../tools/apiClient';
import { useTranslation } from 'react-i18next';
import { setToken, setUsername } from '../slices/authSlice';
import SignupForm from '../forms/SignupForm';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await apiClient.post('/signup', {
        username: values.username,
        password: values.password,
      });
      const { token, username } = response.data;
      dispatch(setToken(token));
      dispatch(setUsername(username));
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrors({ username: t('signup.userExists') });
      } else {
        setErrors({ general: t('errors.default') });
      }
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
              <h3>Регистрация</h3>
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
