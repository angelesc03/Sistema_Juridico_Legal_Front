import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './registerPage.css';
import Swal from 'sweetalert2';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    curp: '',
    rfc: '',
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    colonia: '',
    municipio: '',
    estado: '',
    codigo_postal: '',
    telefono: '',
    email: '',
    grupo_vulnerable: false,
    contrasena: '',
    confirmar_contrasena: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const curpRegex = /^[A-Z]{4}[0-9]{6}[A-Z]{6}[0-9A-Z]{2}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validaciones (igual que antes)
    if (!formData.nombre) newErrors.nombre = 'Nombre es requerido';
    if (!formData.apellido_paterno) newErrors.apellido_paterno = 'Apellido paterno es requerido';
    if (!formData.curp) newErrors.curp = 'CURP es requerida';
    if (formData.curp && !curpRegex.test(formData.curp)) newErrors.curp = 'CURP no válida';
    if (!formData.calle) newErrors.calle = 'Calle es requerida';
    if (!formData.numero_exterior) newErrors.numero_exterior = 'Número exterior es requerido';
    if (!formData.colonia) newErrors.colonia = 'Colonia es requerida';
    if (!formData.municipio) newErrors.municipio = 'Municipio es requerido';
    if (!formData.estado) newErrors.estado = 'Estado es requerido';
    if (!formData.codigo_postal) newErrors.codigo_postal = 'Código postal es requerido';
    if (!formData.telefono) newErrors.telefono = 'Teléfono es requerido';
    if (!formData.email) newErrors.email = 'Email es requerido';
    if (formData.email && !emailRegex.test(formData.email)) newErrors.email = 'Email no válido';
    if (!formData.contrasena) newErrors.contrasena = 'Contraseña es requerida';
    if (formData.contrasena.length < 8) newErrors.contrasena = 'La contraseña debe tener al menos 8 caracteres';
    if (formData.contrasena !== formData.confirmar_contrasena) newErrors.confirmar_contrasena = 'Las contraseñas no coinciden';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Preparamos los datos para enviar a Flask
      const requestData = {
        nombre: formData.nombre,
        apellido_paterno: formData.apellido_paterno,
        apellido_materno: formData.apellido_materno,
        curp: formData.curp,
        rfc: formData.rfc,
        telefono: formData.telefono,
        email: formData.email,
        grupo_vulnerable: formData.grupo_vulnerable,
        contrasena: formData.contrasena,
        domicilio: {
          calle: formData.calle,
          numero: formData.numero_exterior,
          interior: formData.numero_interior,
          colonia: formData.colonia,
          municipio: formData.municipio,
          estado: formData.estado,
          cp: formData.codigo_postal
        }
      };

      // Enviamos la solicitud a tu endpoint de Flask
      const response = await axios.post('https://sistema-juridico-legal-backend.onrender.com/api/registro', requestData);


      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Serás redirigido al inicio de sesión.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      if (error.response) {
        // Manejo de errores específicos del backend
        if (error.response.status === 400) {
          setErrors({ ...errors, general: error.response.data.error });
        } else {
          setErrors({ ...errors, general: 'Error en el servidor' });
        }
      } else {
        setErrors({ ...errors, general: 'Error de conexión' });
      }
    }
  };

   return (
    <div className="register-container">
      <h2>Registro de Usuario</h2>
      {errors.general && <div className="error-message">{errors.general}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre(s)*</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
          {errors.nombre && <span className="error">{errors.nombre}</span>}
        </div>

        <div className="form-group">
          <label>Apellido Paterno*</label>
          <input
            type="text"
            name="apellido_paterno"
            value={formData.apellido_paterno}
            onChange={handleChange}
          />
          {errors.apellido_paterno && <span className="error">{errors.apellido_paterno}</span>}
        </div>

        <div className="form-group">
          <label>Apellido Materno</label>
          <input
            type="text"
            name="apellido_materno"
            value={formData.apellido_materno}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>CURP*</label>
          <input
            type="text"
            name="curp"
            value={formData.curp}
            onChange={handleChange}
            maxLength="18"
          />
          {errors.curp && <span className="error">{errors.curp}</span>}
        </div>

        <div className="form-group">
          <label>RFC</label>
          <input
            type="text"
            name="rfc"
            value={formData.rfc}
            onChange={handleChange}
            maxLength="13"
          />
        </div>

        <h3>Domicilio</h3>
        <div className="form-group">
          <label>Calle*</label>
          <input
            type="text"
            name="calle"
            value={formData.calle}
            onChange={handleChange}
          />
          {errors.calle && <span className="error">{errors.calle}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Número Exterior*</label>
            <input
              type="text"
              name="numero_exterior"
              value={formData.numero_exterior}
              onChange={handleChange}
            />
            {errors.numero_exterior && <span className="error">{errors.numero_exterior}</span>}
          </div>

          <div className="form-group">
            <label>Número Interior</label>
            <input
              type="text"
              name="numero_interior"
              value={formData.numero_interior}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Colonia*</label>
          <input
            type="text"
            name="colonia"
            value={formData.colonia}
            onChange={handleChange}
          />
          {errors.colonia && <span className="error">{errors.colonia}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Municipio*</label>
            <input
              type="text"
              name="municipio"
              value={formData.municipio}
              onChange={handleChange}
            />
            {errors.municipio && <span className="error">{errors.municipio}</span>}
          </div>

          <div className="form-group">
            <label>Estado*</label>
            <input
              type="text"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            />
            {errors.estado && <span className="error">{errors.estado}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Código Postal*</label>
          <input
            type="text"
            name="codigo_postal"
            value={formData.codigo_postal}
            onChange={handleChange}
          />
          {errors.codigo_postal && <span className="error">{errors.codigo_postal}</span>}
        </div>

        <div className="form-group">
          <label>Teléfono*</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
          {errors.telefono && <span className="error">{errors.telefono}</span>}
        </div>

        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            name="grupo_vulnerable"
            checked={formData.grupo_vulnerable}
            onChange={handleChange}
          />
          <label>Pertenezco a un grupo vulnerable</label>
        </div>

        <div className="form-group">
          <label>Contraseña*</label>
          <input
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
          />
          {errors.contrasena && <span className="error">{errors.contrasena}</span>}
        </div>

        <div className="form-group">
          <label>Confirmar Contraseña*</label>
          <input
            type="password"
            name="confirmar_contrasena"
            value={formData.confirmar_contrasena}
            onChange={handleChange}
          />
          {errors.confirmar_contrasena && <span className="error">{errors.confirmar_contrasena}</span>}
        </div>

        <button type="submit" className="submit-button">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterPage;