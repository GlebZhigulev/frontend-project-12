// Signup.jsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from './slices/authSlice';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Минимум 3 символа')
      .max(20, 'Максимум 20 символов')
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
        setErrors({ username: 'Пользователь с таким именем уже существует' });
      } else {
        setErrors({ general: 'Ошибка регистрации. Попробуйте позже.' });
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
                  <Form>
                    {errors.general && (
                      <div className="alert alert-danger">{errors.general}</div>
                    )}
                    <div className="mb-3">
                      <label className="form-label">Имя пользователя:</label>
                      <Field type="text" name="username" className="form-control" />
                      <ErrorMessage name="username" component="div" className="text-danger mt-1" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Пароль:</label>
                      <Field type="password" name="password" className="form-control" />
                      <ErrorMessage name="password" component="div" className="text-danger mt-1" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Подтверждение пароля:</label>
                      <Field type="password" name="confirmPassword" className="form-control" />
                      <ErrorMessage name="confirmPassword" component="div" className="text-danger mt-1" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      Зарегистрироваться
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
