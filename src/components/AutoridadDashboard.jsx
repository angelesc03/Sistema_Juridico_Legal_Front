import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AutoridadDashboard.css';

const AutoridadDashboard = () => {
  const [activeTab, setActiveTab] = useState('pendientes');
  const [demandasPendientes, setDemandasPendientes] = useState([]);
  const [casosActivos, setCasosActivos] = useState([]);

  const userData = JSON.parse(localStorage.getItem('userData'));
  const personaId = userData?.persona_id;

  useEffect(() => {
    obtenerDemandasPendientes();
    obtenerCasosActivos();
  }, []);

  const obtenerDemandasPendientes = async () => {
    try {
      const res = await axios.get('https://sistema-juridico-legal-backend.onrender.com/api/autoridad/autoridad/pendientes');
      setDemandasPendientes(res.data.demandas);
    } catch (err) {
      console.error(err);
    }
  };

  const obtenerCasosActivos = async () => {
    try {
      const res = await axios.get('https://sistema-juridico-legal-backend.onrender.com/api/autoridad/autoridad/activos/${personaId}');
      setCasosActivos(res.data.demandas);
    } catch (err) {
      console.error(err);
    }
  };

  const asignarDemanda = async (demanda) => {
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
        await axios.put('https://sistema-juridico-legal-backend.onrender.com/api/autoridad/autoridad/asignar/${demanda.id}', {
          autoridad_id: personaId
        });

        Swal.fire('¡Caso asignado!', 'La demanda fue asignada exitosamente.', 'success');
        obtenerDemandasPendientes();
        obtenerCasosActivos();
      } catch (error) {
        Swal.fire('Error', 'No se pudo asignar la demanda.', 'error');
      }
    }
  };

  return (
    <div className="autoridad-dashboard">
      <h1>Bienvenido(a), Autoridad Judicial</h1>
      <div className="autoridad-tabs">
        <button className={activeTab === 'pendientes' ? 'active' : ''} onClick={() => setActiveTab('pendientes')}>
          Demandas pendientes
        </button>
        <button className={activeTab === 'activos' ? 'active' : ''} onClick={() => setActiveTab('activos')}>
          Casos activos
        </button>
      </div>

      {activeTab === 'pendientes' && (
        <div className="grid-demandas">
          {demandasPendientes.length === 0 ? (
            <p className="mensaje-vacio">Actualmente no hay procesos legales sin atender.</p>
          ) : (
            demandasPendientes.map((demanda) => (
              <div key={demanda.id} className="tarjeta-demanda" onClick={() => asignarDemanda(demanda)}>
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
          {casosActivos.map((demanda) => (
            <div key={demanda.id} className="fila-caso-activo">
              <div>
                <p><strong>Folio:</strong> {demanda.folio}</p>
                <p><strong>Tipo:</strong> {demanda.tipo_accion}</p>
              </div>
              <span className={`estatus ${demanda.estatus.toLowerCase()}`}>{demanda.estatus}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoridadDashboard;