import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; 
import Swal from 'sweetalert2';
import axios from 'axios';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    contrasena: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('https://sistema-juridico-legal-backend.onrender.com/api/login', credentials);
      
      if (response.data.success) {
        // Mensaje personalizado según el rol
        let mensajeBienvenida = '';
        switch(response.data.rol_id) {
          case 1:
            mensajeBienvenida = `Bienvenido Administrador ${response.data.nombre_completo}`;
            break;
          case 2:
            mensajeBienvenida = `Bienvenida Autoridad ${response.data.nombre_completo}`;
            break;
          case 3:
            mensajeBienvenida = `Bienvenido ${response.data.nombre_completo}`;
            break;
          default:
            mensajeBienvenida = 'Bienvenido al sistema';
        }

        Swal.fire({
          title: '¡Acceso concedido!',
          text: mensajeBienvenida,
          icon: 'success',
          timer: 3000,
          showConfirmButton: false
        }).then(() => {
          // ***********************************************************************
          // Aquí guardarías los datos del usuario en el estado global o localStorage
          // Ejemplo:
          // localStorage.setItem('userData', JSON.stringify(response.data));
          
          // Redirección temporal (luego se hará según el rol)
          // navigate('/dashboard');
          // ***********************************************************************

          if (response.data.success) {
              // ... mensaje de bienvenida ...
              
              // Guardar datos en localStorage
              localStorage.setItem('userData', JSON.stringify(response.data));
              
              // Redirección según rol
              if (response.data.rol_id === 1) {
                  navigate('/admin');
              } else if (response.data.rol_id === 2) {
                  navigate('/autoridad');
              } else {
                  navigate('/usuario');
              }
          }
          
        });
      }
    } catch (error) {
      if (error.response) {
        const { data, status } = error.response;
        
        if (status === 404 && data.codigo === 1) {
          Swal.fire({
            title: 'Usuario no encontrado',
            text: 'El correo no está registrado. Por favor regístrese primero.',
            icon: 'error'
          });
        } else if (status === 403 && data.codigo === 2) {
          Swal.fire({
            title: 'Validación pendiente',
            text: data.message,
            icon: 'info',
            timer: 3500,
            showConfirmButton: false
          });
        } else if (status === 401 && data.codigo === 3) {
          Swal.fire({
            title: 'Credenciales inválidas',
            text: 'La contraseña ingresada es incorrecta',
            icon: 'error'
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error inesperado',
            icon: 'error'
          });
        }
      } else {
        Swal.fire({
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor',
          icon: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Validando...' : 'Ingresar'}
          </button>
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