// Header.jsx
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routes from '../tools/routes';
import { useAuth } from './contexts/AuthContext';

const Header = () => {
  const { t } = useTranslation();
  const { token, logout } = useAuth();

  return (
    <nav className="navbar navbar-dark bg-dark mb-3">
      {/* container-fluid вместо container */}
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Название приложения слева */}
        <Link className="navbar-brand" to="/">
          {t('header.title')}
        </Link>
        <div>
          {token ? (
            <button type="button" className="btn btn-outline-light" onClick={logout}>
              {t('header.logout')}
            </button>
          ) : (
            <>
              <Link className="btn btn-outline-light me-2" to={routes.login}>
                {t('header.login')}
              </Link>
              <Link className="btn btn-outline-light" to={routes.signup}>
                {t('header.signup')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
