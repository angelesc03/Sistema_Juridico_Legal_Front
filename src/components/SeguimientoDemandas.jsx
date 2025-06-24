import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './SeguimientoDemandas.css';

const SeguimientoDemandas = () => {
    const [demandas, setDemandas] = useState([]);
    const [loading, setLoading] = useState(true);
    const userData = JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        const cargarDemandas = async () => {
            try {
                const response = await axios.get(
                    'https://sistema-juridico-legal-backend.onrender.com/api/demandas/mis-demandas', 
                    { params: { persona_id: userData.persona_id } }
                );
                
                if (response.data.success) {
                    setDemandas(response.data.demandas);
                } else {
                    Swal.fire('Error', 'No se pudieron cargar las demandas', 'error');
                }
            } catch (error) {
                Swal.fire('Error', error.response?.data?.error || 'Error al cargar demandas', 'error');
            } finally {
                setLoading(false);
            }
        };
        
        cargarDemandas();
    }, [userData.persona_id]);

    return (
        <div className="seguimiento-container">
            <h2>Seguimiento de Demandas</h2>
            
            {loading ? (
                <p>Cargando demandas...</p>
            ) : (
                <div className="demandas-grid">
                    {demandas.length > 0 ? (
                        demandas.map((demanda, index) => (
                            <div key={index} className="demanda-card">
                                <div className="demanda-header">
                                    <h3>{demanda.folio}</h3>
                                    <span className={`estatus ${demanda.estatus.toLowerCase()}`}>
                                        {demanda.estatus}
                                    </span>
                                </div>
                                
                                <div className="demanda-body">
                                    <div className="demanda-info">
                                        <label>Tipo:</label>
                                        <p>{demanda.tipo_accion}</p>
                                    </div>
                                    
                                    <div className="demanda-info">
                                        <label>Demandante:</label>
                                        <p>{demanda.demandante}</p>
                                    </div>
                                    
                                    <div className="demanda-info">
                                        <label>Demandado:</label>
                                        <p>{demanda.demandado}</p>
                                    </div>
                                    
                                    <div className="demanda-info">
                                        <label>Autoridad:</label>
                                        <p>{demanda.autoridad}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No estás involucrado en ningún proceso legal actualmente.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SeguimientoDemandas;