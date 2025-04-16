// Signup.jsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from './slices/authSlice';
import { useTranslation } from 'react-i18next';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле'),
    password: Yup.string()
      .min(6, 'Минимум 6 символов')
      .required('Обязательное поле'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
      .required('Обязательное поле'),
  });

  const initialValues = { username: '', password: '', confirmPassword: '' };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post('/api/v1/signup', {
        username: values.username,
        password: values.password,
      });
      // Предполагаем, что сервер возвращает token при успешной регистрации
      const { token } = response.data;
      dispatch(setToken(token));
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
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors }) => (
                  <Form data-testid="signup-form">
                    {errors.general && (
                      <div className="alert alert-danger">{errors.general}</div>
                    )}
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">{t('signup.username')}</label>
                      <Field name="username">
                        {({ field }) => (
                          <input
                            {...field}
                            id="username"
                            type="text"
                            autoComplete="username"
                            className="form-control"
                          />
                        )}
                      </Field>
                      <ErrorMessage name="username" component="div" className="text-danger mt-1" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">{t('signup.password')}</label>
                      <Field name="password">
                        {({ field }) => (
                          <input
                            {...field}
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            className="form-control"
                          />
                        )}
                      </Field>
                      <ErrorMessage name="password" component="div" className="text-danger mt-1" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">{t('signup.confirmPassword')}</label>
                      <Field name="confirmPassword">
                        {({ field }) => (
                          <input
                            {...field}
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            className="form-control"
                          />
                        )}
                      </Field>
                      <ErrorMessage name="confirmPassword" component="div" className="text-danger mt-1" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {t('signup.signupBtn')}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
