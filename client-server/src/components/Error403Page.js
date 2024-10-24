import React from 'react';
import './style.css';

function Error403Page() {
  return (
    <div className="error-page"
    style={{
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}
    >
      <h2>Acesso Negado (403)</h2>
      <p>Você não tem permissão para acessar este recurso.</p>
      <p>Por favor, verifique suas credenciais.</p>
    </div>
  );
}

export default Error403Page;
