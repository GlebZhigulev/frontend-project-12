// Login.jsx
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setToken, setError, setUsername } from './slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const error = useSelector((state) => state.auth.error);

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('/api/v1/login', values);
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
              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Form>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                          {t('login.username')}
                        </label>
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
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="text-danger mt-1"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          {t('login.password')}
                        </label>
                        <Field name="password">
                          {({ field }) => (
                            <input
                              {...field}
                              id="password"
                              type="password"
                              autoComplete="current-password"
                              className="form-control"
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-danger mt-1"
                        />
                      </div>
                      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {t('login.loginBtn')}
                      </button>
                    </Form>
                  </>
                )}
              </Formik>
              <div className="mt-3">
                <p>
                  {t('login.noAccount')}
                  {' '}
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
