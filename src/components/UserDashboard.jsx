import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LevantarDemanda from './LevantarDemanda';
import './UserDashboard.css';
import SeguimientoDemandas from './SeguimientoDemandas';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('levantar');
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData'));

    const handleLogout = () => {
        localStorage.removeItem('userData');
        navigate('/login');
    };

    return (
        <div className="user-dashboard-container">
            <div className="user-header">
                <h1>Usuario: {userData?.nombre_completo || 'Invitado'}</h1>
                <div className="user-menu">
                    <button 
                        className={`menu-button ${activeTab === 'levantar' ? 'active' : ''}`}
                        onClick={() => setActiveTab('levantar')}
                    >
                        Levantar una demanda
                    </button>
                    <button 
                        className={`menu-button ${activeTab === 'seguimiento' ? 'active' : ''}`}
                        onClick={() => setActiveTab('seguimiento')}
                    >
                        Ver seguimiento
                    </button>
                    <button className="menu-button" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
            
            <div className="user-content">
                {activeTab === 'levantar' && <LevantarDemanda />}
                {activeTab === 'seguimiento' && <SeguimientoDemandas />}
            </div>
        </div>
    );
};

export default UserDashboard;