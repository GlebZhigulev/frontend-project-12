import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.jsx'; 
import Login from './components/Login.jsx'; 
import NotFound from './components/NotFound.jsx';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  return (
    <Router>
      <Routes>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="*" component={NotFound} />
      </Routes>
    </Router>
  );
}

export default App;
