import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App.jsx';
import './index.css';

// 👇 Importa HashRouter
import { HashRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
