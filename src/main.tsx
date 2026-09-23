import React from 'react';
import ReactDOM from 'react-dom/client';
import Workspace from '../app/workspace';
import '../app/globals.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Workspace user="GGCDC Civic Delegate (Monrovia / Zwedru)" />
    </React.StrictMode>
  );
}
