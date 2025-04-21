// App.jsx
import {
  BrowserRouter as Router, Route, Routes, Navigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToken } from '../slices/authSlice';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Header from './Header';
import { setupSocket } from '../tools/socket'; // 👈 импорт
import store from '../slices/store';
import routes from '../tools/routes';
import ModalRoot from './modals/ModalRoot';

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (!localToken) {
      dispatch(removeToken());
    }

    setupSocket(store);
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <ModalRoot />
      <Routes>
        <Route path={routes.root} element={token ? <Chat /> : <Navigate to={routes.login} replace />} />
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.signup} element={<Signup />} />
        <Route path={routes.notFound} element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
