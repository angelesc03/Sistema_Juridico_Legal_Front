import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminNombre, setAdminNombre] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener datos del admin del localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || userData.rol_id !== 1) {
            navigate('/login');
            return;
        }
        
        setAdminNombre(userData.nombre_completo);
        cargarUsuariosPendientes();
    }, []);

    const cargarUsuariosPendientes = async () => {
        try {
            const response = await axios.get('https://sistema-juridico-legal-backend.onrender.com/api/admin/usuarios-pendientes');
            setUsuarios(response.data.usuarios);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAsignarRol = async (usuarioId, rolId) => {
        try {
            await axios.post('https://sistema-juridico-legal-backend.onrender.com/api/admin/asignar-rol', {
                usuario_id: usuarioId,
                rol_id: rolId
            });
            
            Swal.fire('Éxito', 'Rol asignado correctamente', 'success');
            cargarUsuariosPendientes();
        } catch (error) {
            Swal.fire('Error', 'No se pudo asignar el rol', 'error');
        }
    };

    const handleDesactivarUsuario = async (usuarioId) => {
        try {
            await axios.post('https://sistema-juridico-legal-backend.onrender.com/api/admin/desactivar-usuario', {
                usuario_id: usuarioId
            });
            
            Swal.fire('Éxito', 'Usuario desactivado correctamente', 'success');
            cargarUsuariosPendientes();
        } catch (error) {
            Swal.fire('Error', 'No se pudo desactivar el usuario', 'error');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userData');
        navigate('/login');
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Administrador: {adminNombre}</h1>
                <div className="admin-menu">
                    <button className="menu-button active">Gestión Usuarios</button>
                    <button className="menu-button" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            </div>
            
            <div className="admin-content">
                {loading ? (
                    <p>Cargando usuarios...</p>
                ) : (
                    <table className="usuarios-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido Paterno</th>
                                <th>Apellido Materno</th>
                                <th>CURP</th>
                                <th>RFC</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(usuario => (
                                <tr key={usuario.id}>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.apellido_paterno}</td>
                                    <td>{usuario.apellido_materno || 'N/A'}</td>
                                    <td>{usuario.curp}</td>
                                    <td>{usuario.rfc || 'N/A'}</td>
                                    <td className="acciones-cell">
                                        <select 
                                            className="rol-select"
                                            onChange={(e) => handleAsignarRol(usuario.usuario_id, e.target.value)}
                                        >
                                            <option value="">Asignar rol...</option>
                                            <option value="1">Administrador</option>
                                            <option value="2">Autoridad Judicial</option>
                                            <option value="3">Usuario</option>
                                        </select>
                                        <button 
                                            className="desactivar-button"
                                            onClick={() => handleDesactivarUsuario(usuario.usuario_id)}
                                        >
                                            Dar de baja
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;