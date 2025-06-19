import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import Home from './components/home';
import LoginPage from './components/login';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
