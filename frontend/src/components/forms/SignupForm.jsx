import React from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

function SignupForm({ onSubmit }) {
  const { t } = useTranslation();

  const initialValues = { username: '', password: '', confirmPassword: '' };
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле'),
    password: Yup.string()
      .min(6, 'Не менее 6 символов')
      .required('Обязательное поле'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
      .required('Обязательное поле'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors }) => (
        <Form data-testid="signup-form">
          {errors.general && <div className="alert alert-danger">{errors.general}</div>}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">{t('signup.username')}</label>
            <Field
              id="username"
              name="username"
              autoComplete="username"
              className="form-control"
            />
            <ErrorMessage name="username" component="div" className="text-danger mt-1" />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">{t('signup.password')}</label>
            <Field
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              className="form-control"
            />
            <ErrorMessage name="password" component="div" className="text-danger mt-1" />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              {t('signup.confirmPassword')}
            </label>
            <Field
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="form-control"
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-danger mt-1"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? t('signup.registering') : t('signup.signupBtn')}
          </button>
        </Form>
      )}
    </Formik>
  );
}

SignupForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SignupForm;
