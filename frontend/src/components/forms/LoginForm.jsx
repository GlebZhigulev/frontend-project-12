import React from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

function LoginForm({ onSubmit, error }) {
  const { t } = useTranslation();

  const initialValues = { username: '', password: '' };
  const validationSchema = Yup.object({
    username: Yup.string().required(t('validation.required')),
    password: Yup.string().required(t('validation.required')),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form data-testid="login-form">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">{t('login.username')}</label>
            <Field
              id="username"
              name="username"
              autoComplete="username"
              className="form-control"
            />
            <ErrorMessage name="username" component="div" className="text-danger mt-1" />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">{t('login.password')}</label>
            <Field
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="form-control"
            />
            <ErrorMessage name="password" component="div" className="text-danger mt-1" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? t('login.loggingIn') : t('login.loginBtn')}
          </button>
        </Form>
      )}
    </Formik>
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
};
LoginForm.defaultProps = {
  error: null,
};

export default LoginForm;
