import React from 'react';
import '../styles/ErrorComponent.css';

interface ErrorComponentProps {
  message: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = () => {
  return (
    <div className="error-container">
      <div className="error-icon">
        <svg
          className="error-icon-svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2v6m-6 4h12a2 2 0 002-2V8a2 2 0 00-.6-1.4l-6-6a2 2 0 00-1.4-.6H6a2 2 0 00-2 2v16a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h2 className="error-title">Error al cargar la información</h2>
      <button className="error-button" onClick={() => window.location.reload()}>
        Cargar de Nuevo
      </button>
    </div>
  );
};

export default ErrorComponent;
