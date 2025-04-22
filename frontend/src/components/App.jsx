// App.jsx
import {
  BrowserRouter as Router, Route, Routes, Navigate,
} from 'react-router-dom';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Header from './Header';
import routes from '../tools/routes';
import ModalRoot from './modals/ModalRoot';

const AppContent = () => {
  const { token } = useAuth();

  return (
    <>
      <Header />
      <ModalRoot />
      <Routes>
        <Route
          path={routes.root}
          element={token ? <Chat /> : <Navigate to={routes.login} replace />}
        />
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.signup} element={<Signup />} />
        <Route path={routes.notFound} element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;
