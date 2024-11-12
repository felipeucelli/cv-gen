import React, { useState } from 'react';
import './style.css'

const SuperioresForm = ({ setDados }) => {
  const [superiores, setSuperiores] = useState([]);
  const [id, setId] = useState(0)

  const setSuperiorCampo = (id, campo, valor) => {
    setSuperiores((prevSuperiores) => {
      const novosSuperiores = prevSuperiores.map((superior) =>
        superior.id === id ? { ...superior, [campo]: valor } : superior
      );
      
      // Depois de atualizar o estado, também modificamos o superior
      const superiorModificado = novosSuperiores.find((superior) => superior.id === id);
      modificarSuperior(superiorModificado);
      
      return novosSuperiores; // Retornar o novo estado atualizado
    });
  };
  


  const adicionarSuperior = (novoSuperior) => {
    setDados((prevCurriculo) => ({
      ...prevCurriculo,
      superiores: [...prevCurriculo.superiores, novoSuperior]
    }));
  };

  const modificarSuperior = (superiorModificado) => {
    setDados((prevCurriculo) => ({
      ...prevCurriculo,
      superiores: prevCurriculo.superiores.map((superiores) =>
      superiores.id === superiorModificado.id ? superiorModificado : superiores
      )
    }));
  };

  const excluirSuperior = (id) => {
    setDados((prevCurriculo) => ({
      ...prevCurriculo,
      superiores: prevCurriculo.superiores.filter((superiores) => superiores.id !== id)
    }));
  };

 

  const handleAddSuperior = () => {
    const novoSuperior = {
      id: id,
      superior: '',
      nivel: ''
    };
    setId(id + 1)
    setSuperiores([...superiores, novoSuperior]);
    adicionarSuperior(novoSuperior);
  };

  const handleRemoveSuperior = (id) => {
    setSuperiores((prevSuperiores) => prevSuperiores.filter((superior) => superior.id !== id));
    excluirSuperior(id);
  };
  const options = [  
    'BACHAREL',
    'TECNICO',
    'MESTRADO',
    'LICENCIATURA',
    'DOUTORADO',
    'PHd', 

  ];

  return (
    <div style={{
      marginTop: '20px',
      padding: '8px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.3)',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div >
        <h2 >Curso Superior</h2>
      </div>
      
      {superiores.map((superior) => (
        <div key={superior.id} style={{ marginBottom: '20px' }}>


          <label className='label'>Curso:
              <input
                type="text"
                value={superior.superior}
                placeholder='Nome do Curso superior'
                onChange={(e) => setSuperiorCampo(superior.id, 'superior', e.target.value.toUpperCase())}
                className='inputs'
              />
            </label>


            <label className='label' htmlFor="comboBox">Nivel:
              <select id="comboBox" 
              value={superior.nivel}             
              onChange={(e) => setSuperiorCampo(superior.id, 'nivel', e.target.value)}
              className='inputs'
              >

              <option value="" disabled hidden>Selecione...</option>
                  {options.map((option) => (
                  <option key={option} value={option}>
                      {option}
                  </option>
                ))}

              </select>
          </label>


          <div >
              <button           
              onClick={() => handleRemoveSuperior(superior.id)}
              >Remover</button>
          </div>
          
        </div>
      ))}
      <div >
      <button
      onClick={handleAddSuperior}
       >Adicionar Superior</button>
      </div>
      
    </div>
  );
};

export default SuperioresForm;
