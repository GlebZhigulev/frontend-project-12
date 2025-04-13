// App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeToken } from './slices/authSlice';
import Chat from './Chat.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import NotFound from './NotFound.jsx';
import Header from './Header.jsx';


const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(removeToken());
    }
  }, [dispatch]);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  ); 
};

export default App;
