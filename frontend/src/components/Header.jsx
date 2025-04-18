// Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { removeToken } from '../slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const token = useSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(removeToken());
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-dark bg-dark mb-3">
      {/* container-fluid вместо container */}
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Название приложения слева */}
        <Link className="navbar-brand" to="/">
          {t('header.title')}
        </Link>

        {/* Блок с кнопками справа */}
        <div>
          {token ? (
            <button type="button" className="btn btn-outline-light" onClick={handleLogout}>
              {t('header.logout')}
            </button>
          ) : (
            <>
              <Link className="btn btn-outline-light me-2" to="/login">
                {t('header.login')}
              </Link>
              <Link className="btn btn-outline-light" to="/signup">
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
