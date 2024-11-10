import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken, setError } from './slices/authSlice.jsx';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Валидация с использованием Yup
  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('/api/login', values);
      const { token } = response.data;
      dispatch(setToken(token)); // Сохраняем токен в Redux и localStorage
      navigate('/'); // Перенаправляем на главную
    } catch (error) {
      dispatch(setError('Неправильное имя пользователя или пароль'));
    } finally {
      setSubmitting(false); // Разрешаем повторную отправку формы
    }
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label>Username:</label>
            <Field type="text" name="username" />
            <ErrorMessage name="username" component="div" />
          </div>
          <div>
            <label>Password:</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
          </div>
          <button type="submit" disabled={isSubmitting}>
            Login
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default Login;
