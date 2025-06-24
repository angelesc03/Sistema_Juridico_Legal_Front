import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import Home from './components/home';
import LoginPage from './components/login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import LevantarDemanda from './components/LevantarDemanda';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/usuario" element={<UserDashboard />} />
        <Route path="/levantar-demanda" element={<LevantarDemanda />} />
      </Routes>
    </div>
  );
}

export default App;
