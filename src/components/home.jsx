import './home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="main-title">Sistema Jurídico Legal</h1>
      <div className="button-container">
        <button 
          className="main-button"
          onClick={() => navigate('/registro')}
        >
          Registrarse
        </button>
        <button 
          className="main-button"
          onClick={() => navigate('/login')}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}

export default Home;
