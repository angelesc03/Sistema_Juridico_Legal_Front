import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AutoridadDashboard.css';

const AutoridadDashboard = () => {
  const [activeTab, setActiveTab] = useState('pendientes');
  const [demandasPendientes, setDemandasPendientes] = useState([]);
  const [casosActivos, setCasosActivos] = useState([]);
  const [autoridadNombre, setAutoridadNombre] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Validación del usuario al cargar
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));

    if (!storedData || storedData.rol_id !== 2) {
      navigate('/login');
      return;
    }

    setAutoridadNombre(storedData.nombre_completo);
    cargarDatos(storedData.persona_id);
  }, []);

  const cargarDatos = async (personaId) => {
    try {
      const [resPendientes, resActivos] = await Promise.all([
        axios.get('https://sistema-juridico-legal-backend.onrender.com/api/autoridad/autoridad/pendientes'),
        axios.get(`https://sistema-juridico-legal-backend.onrender.com/api/autoridad/autoridad/activos/${personaId}`)
      ]);

      setDemandasPendientes(resPendientes.data.demandas);
      setCasosActivos(resActivos.data.demandas);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los datos del servidor.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const asignarDemanda = async (demanda) => {
    const storedData = JSON.parse(localStorage.getItem('userData'));

    const confirm = await Swal.fire({
      title: `Folio: ${demanda.folio}`,
      html: `
        <p><strong>Tipo de acción:</strong> ${demanda.tipo_accion}</p>
        <p><strong>Fecha de creación:</strong> ${demanda.fecha_creacion}</p>
        <p><strong>Pretensiones:</strong> ${demanda.pretensiones}</p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Elegir caso',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(`https://sistema-juridico-legal-backend.onrender.com/api/autoridad/autoridad/asignar/${demanda.id}`, {
          autoridad_id: storedData.persona_id
        });

        Swal.fire('¡Caso asignado!', 'La demanda fue asignada exitosamente.', 'success');
        cargarDatos(storedData.persona_id);
      } catch (error) {
        Swal.fire('Error', 'No se pudo asignar la demanda.', 'error');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <div className="autoridad-dashboard">
      <div className="autoridad-header">
        <h1>Autoridad Judicial: {autoridadNombre}</h1>
        <div className="autoridad-menu">
          <button className="menu-button active">Demandas</button>
          <button className="menu-button" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </div>

      <div className="autoridad-tabs">
        <button className={activeTab === 'pendientes' ? 'active' : ''} onClick={() => setActiveTab('pendientes')}>
          Demandas pendientes
        </button>
        <button className={activeTab === 'activos' ? 'active' : ''} onClick={() => setActiveTab('activos')}>
          Casos activos
        </button>
      </div>

      {loading ? (
        <p className="mensaje-vacio">Cargando datos...</p>
      ) : (
        <>
          {activeTab === 'pendientes' && (
            <div className="grid-demandas">
              {demandasPendientes.length === 0 ? (
                <p className="mensaje-vacio">No hay demandas pendientes.</p>
              ) : (
                demandasPendientes.map((demanda) => (
                  <div
                    key={demanda.id}
                    className="tarjeta-demanda"
                    onClick={() => asignarDemanda(demanda)}
                  >
                    <p><strong>Folio:</strong> {demanda.folio}</p>
                    <p><strong>Tipo:</strong> {demanda.tipo_accion}</p>
                    <p><strong>Fecha:</strong> {demanda.fecha_creacion}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'activos' && (
            <div className="lista-casos-activos">
              {casosActivos.length === 0 ? (
                <p className="mensaje-vacio">No tienes casos activos asignados.</p>
              ) : (
                casosActivos.map((demanda) => (
                  <div key={demanda.id} className="fila-caso-activo">
                    <div>
                      <p><strong>Folio:</strong> {demanda.folio}</p>
                      <p><strong>Tipo:</strong> {demanda.tipo_accion}</p>
                    </div>
                    <span className={`estatus ${demanda.estatus.toLowerCase()}`}>{demanda.estatus}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AutoridadDashboard;
