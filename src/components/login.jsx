import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; 
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

const handleSubmit = (e) => {
  e.preventDefault();
  Swal.fire({
    title: 'Sus credenciales se encuentran en proceso de validación ...',
    text: 'En poco tiempo podrá acceder al sistema',
    icon: 'info',
    timer: 3500,
    showConfirmButton: false
  });
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="contrasena"
              value={credentials.contrasena}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Ingresar</button>
        </form>
        <p className="register-text">
          ¿No tienes cuenta?{' '}
          <span className="link" onClick={() => navigate('/registro')}>Regístrate aquí</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
