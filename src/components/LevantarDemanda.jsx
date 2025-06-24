import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './LevantarDemanda.css';

const LevantarDemanda = () => {
    const [formData, setFormData] = useState({
        demandado_nombre: '',
        demandado_apellido_paterno: '',
        demandado_apellido_materno: '',
        pretensiones: '',
        hechos: '',
        fundamento_derecho: '',
        tipo_accion: ''
    });
    const [folio, setFolio] = useState('');
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Obtener datos del usuario del localStorage
        const data = JSON.parse(localStorage.getItem('userData'));
        setUserData(data);
        
        // Generar folio automático
        generarFolio();
    }, []);

    const generarFolio = async () => {
        try {
            const response = await axios.get('https://sistema-juridico-legal-backend.onrender.com/api/demandas/generar-folio');
            setFolio(response.data.folio);
        } catch (error) {
            Swal.fire('Error', 'No se pudo generar el folio', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const buscarDemandado = async () => {
        try {
            const response = await axios.post('https://sistema-juridico-legal-backend.onrender.com/api/demandas/buscar-demandado', {
                nombre: formData.demandado_nombre,
                apellido_paterno: formData.demandado_apellido_paterno,
                apellido_materno: formData.demandado_apellido_materno
            });
            
            return response.data.persona_id;
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo encontrar al demandado', 'error');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Validar campos
            if (!formData.demandado_nombre || !formData.demandado_apellido_paterno) {
                throw new Error('Nombre y apellido paterno del demandado son requeridos');
            }
            
            if (!formData.pretensiones || !formData.hechos || !formData.fundamento_derecho || !formData.tipo_accion) {
                throw new Error('Todos los campos de la demanda son obligatorios');
            }
            
            // Buscar al demandado
            const demandado_id = await buscarDemandado();
            if (!demandado_id) return;
            
            // Crear la demanda
            await axios.post('https://sistema-juridico-legal-backend.onrender.com/api/demandas/crear', {
                folio: folio,
                demandante_id: userData.persona_id,
                demandado_id: demandado_id,
                pretensiones: formData.pretensiones,
                hechos: formData.hechos,
                fundamento_derecho: formData.fundamento_derecho,
                tipo_accion: formData.tipo_accion
            });
            
            Swal.fire('Éxito', 'Demanda levantada correctamente', 'success');
            
            // Limpiar formulario
            setFormData({
                demandado_nombre: '',
                demandado_apellido_paterno: '',
                demandado_apellido_materno: '',
                pretensiones: '',
                hechos: '',
                fundamento_derecho: '',
                tipo_accion: ''
            });
            
            // Generar nuevo folio
            generarFolio();
            
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="levantar-demanda-container">
            <h2>Levantar Nueva Demanda</h2>
            <p className="folio">Folio: {folio}</p>
            
            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h3>Datos del Demandado</h3>
                    
                    <div className="form-group">
                        <label>Nombre(s):</label>
                        <input
                            type="text"
                            name="demandado_nombre"
                            value={formData.demandado_nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Apellido Paterno:</label>
                        <input
                            type="text"
                            name="demandado_apellido_paterno"
                            value={formData.demandado_apellido_paterno}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Apellido Materno (opcional):</label>
                        <input
                            type="text"
                            name="demandado_apellido_materno"
                            value={formData.demandado_apellido_materno}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                
                <div className="form-section">
                    <h3>Detalles de la Demanda</h3>
                    
                    <div className="form-group">
                        <label>Pretensiones:</label>
                        <textarea
                            name="pretensiones"
                            value={formData.pretensiones}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Hechos:</label>
                        <textarea
                            name="hechos"
                            value={formData.hechos}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Fundamento de Derecho:</label>
                        <select
                            name="fundamento_derecho"
                            value={formData.fundamento_derecho}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione una opción</option>
                            <option value="Artículo X constitucional">Artículo X constitucional</option>
                            <option value="Ley federal del trabajo">Ley federal del trabajo</option>
                            <option value="Código civil federal">Código civil federal</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Tipo de Acción:</label>
                        <select
                            name="tipo_accion"
                            value={formData.tipo_accion}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione una opción</option>
                            <option value="civil">Civil</option>
                            <option value="penal">Penal</option>
                            <option value="administrativa">Administrativa</option>
                            <option value="laboral">Laboral</option>
                            <option value="mercantil">Mercantil</option>
                            <option value="familiar">Familiar</option>
                            <option value="amparo">Amparo</option>
                            <option value="constitucional">Constitucional</option>
                        </select>
                    </div>
                </div>
                
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Procesando...' : 'Levantar Demanda'}
                </button>
            </form>
        </div>
    );
};

export default LevantarDemanda;