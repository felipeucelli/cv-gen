import React, { useState } from 'react';

const ProfissoesForm = ({ setDados }) => {
  const [profissoes, setProfissoes] = useState([]);
  const [id, setId] = useState(0)

  const setProfissaoCampo = (id, campo, valor) => {
    setProfissoes((prevProfissoes) => {
      const novaProfissao = prevProfissoes.map((profissao) =>
        profissao.id === id ? { ...profissao, [campo]: valor } : profissao
      )
      const profissaoModificada = novaProfissao.find((profissao) => profissao.id === id);
      modificarProfissao(profissaoModificada);

      return novaProfissao
  });

    
  };

  const adicionarProfissao = (novaProfissao) => {
    setDados((prevCurriculo) => ({
      ...prevCurriculo,
      profissoes: [...prevCurriculo.profissoes, novaProfissao]
    }));
  };

  const modificarProfissao = (profissaoModificada) => {
    setDados((prevCurriculo) => ({
      ...prevCurriculo,
      profissoes: prevCurriculo.profissoes.map((profissao) =>
        profissao.id === profissaoModificada.id ? profissaoModificada : profissao
      )
    }));
  };

  const excluirProfissao = (id) => {
    setDados((prevCurriculo) => ({
      ...prevCurriculo,
      profissoes: prevCurriculo.profissoes.filter((profissao) => profissao.id !== id)
    }));
  };

  const handleAddProfissao = () => {
    const novaProfissao = {
      id: id,
      cargo: '',
      empresa: '',
      periodo: '',
      cidade: ''
    };
    setId(id + 1)
    setProfissoes([...profissoes, novaProfissao]);
    adicionarProfissao(novaProfissao);
  };

  const handleRemoveProfissao = (id) => {
    setProfissoes((prevProfissoes) => prevProfissoes.filter((profissao) => profissao.id !== id));
    excluirProfissao(id);
  };

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
        <h2 >Experiencias Proficionais</h2>
      </div>
      
      {profissoes.map((profissao) => (
        <div key={profissao.id} style={{ marginBottom: '20px' }}>


        <label className='label'>Empresa:
            <input
              type="text"
              value={profissao.empresa}
              placeholder='Empresa que você trabalhou'
              onChange={(e) => setProfissaoCampo(profissao.id, 'empresa', e.target.value.toUpperCase())}
              className='inputs'
            />
          </label>


          <label className='label'>Cargo:
            <input
              type="text"
              value={profissao.cargo}
              placeholder='Seu cargo na empresa'
              onChange={(e) => setProfissaoCampo(profissao.id, 'cargo', e.target.value.toUpperCase())}
              className='inputs'
            />
          </label>

          <label className='label'>Período:
            <input
              type="text"
              value={profissao.periodo}
              placeholder='Tempo trabalhado'
              onChange={(e) => setProfissaoCampo(profissao.id, 'periodo', e.target.value.toUpperCase())}
              className='inputs'
            />
          </label>

          
          <label className='label'>Cidade:
            <input
              type="text"
              value={profissao.cidade}
              placeholder='Cidade que trabalhou'
              onChange={(e) => setProfissaoCampo(profissao.id, 'cidade', e.target.value.toUpperCase())}
              className='inputs'
            />
          </label>

          <div >
             <button onClick={() => handleRemoveProfissao(profissao.id)}
              >Remover</button>
          </div>
          
        </div>
      ))}
      <div >
      <button onClick={handleAddProfissao}
      >Adicionar Experiencia</button>
      </div>
      
    </div>
  );
};

export default ProfissoesForm;
