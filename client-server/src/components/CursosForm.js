import React, { useState } from 'react';

const CursosForm = ({setDados} ) => {
  const [cursos, setCursos] = useState([]);
  const [id, setId] = useState(0)

  const setCursoCampo = (id, campo, valor) => {
    setCursos((prevCursos) => {
      const novosCursos = prevCursos.map((curso) =>
        curso.id === id ? { ...curso, [campo]: valor } : curso
      );

      const cursoModificado = novosCursos.find((curso) => curso.id === id);
      modificarCurso(cursoModificado);

      return novosCursos
    });
  };


  const adicionarCurso = (novoCurso) => {
    setDados((prevCurriculo) => ({
      ...prevCurriculo,
      cursos: [...prevCurriculo.cursos, novoCurso]
    }));
  };

  const modificarCurso = (cursoModificado) => {
    setDados((prevCurriculo) => ({
      ...prevCurriculo,
      cursos: prevCurriculo.cursos.map((cursos) =>
      cursos.id === cursoModificado.id ? cursoModificado : cursos
      )
    }));
  };

  const excluirCurso = (id) => {
    setDados((prevCurriculo) => ({
      ...prevCurriculo,
      cursos: prevCurriculo.cursos.filter((cursos) => cursos.id !== id)
    }));
  };


  const handleAddCurso = () => {
    const novoCurso = {
      id: id,
      curso: '',
      carga: '',
    };
    setId(id + 1)
    setCursos([...cursos, novoCurso]);
    adicionarCurso(novoCurso);
  };

  const handleRemoveCurso = (id) => {
    setCursos((prevCursos) => prevCursos.filter((curso) => curso.id !== id));
    excluirCurso(id);
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
        <h2 >Cursos</h2>
      </div>
      
      {cursos.map((curso) => (
        <div key={curso.id} style={{ marginBottom: '20px' }}>


        <label className='label'>Curso:
            <input
              type="text"
              value={curso.curso}
              placeholder='Nome do curso'
              onChange={(e) => setCursoCampo(curso.id, 'curso', e.target.value.toUpperCase())}
              className='inputs'
            />
          </label>
          <label className='label'>Carga Horaria:
            <input
              type="number"
              value={curso.carga}
              placeholder='Carga horaria do curso'
              onChange={(e) => setCursoCampo(curso.id, 'carga', e.target.value.toUpperCase())}
              className='inputs'
            />
          </label>


          <div >
              <button onClick={() => handleRemoveCurso(curso.id)}
              >Remover</button>
          </div>
          
        </div>
      ))}
      <div >
      <button onClick={handleAddCurso}
       >Adicionar Curso</button>
      </div>
      
    </div>
  );
};

export default CursosForm;
