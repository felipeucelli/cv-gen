import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './style.css';
import ProfissoesForm from './ProfissoesForm.js';
import CursosForm from './CursosForm.js';
import SuperioresForm from './SuperioresForm.js';
import Finished from './Finished.js';

const AlgumComponente = () => {
  const [exibirPagina2, setExibirPagina2] = useState(false);
  const { id } = useParams();
  const [erros, setErros] = useState({}); // Estado para armazenar erros de validação

  const [dados, setDados] = useState({
    nome: '',
    endereco: '',
    municipio: '',
    telefone: '',
    civil: '',
    nascimento: '',
    naturalidade: '',
    escolar: '',
    superiores: [],
    cursos: [],
    profissoes: [],
    has_cursos: false,
    has_superiores: false,
    has_profissoes: false,
  });

  const [imagem, setImagem] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleChange('foto', event.target.files[0].name);
    setImagem(file);
  };

  const formatarTelefone = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const handleChange = (campo, valor) => {
    let novoValor = valor;

    if (campo === 'telefone') {
      novoValor = formatarTelefone(valor);
    }

    setDados((prevState) => ({
      ...prevState,
      [campo]: novoValor,
    }));
  };

  const validarCampos = () => {
    const novosErros = {};
    // Validação para cada campo obrigatório
    if (!dados.nome) novosErros.nome = 'Nome é obrigatório';
    if (!dados.endereco) novosErros.endereco = 'Endereço é obrigatório';
    if (!dados.municipio) novosErros.municipio = 'Município é obrigatório';
    if (!dados.telefone) novosErros.telefone = 'Telefone é obrigatório';
    if (!dados.civil) novosErros.civil = 'Estado civil é obrigatório';
    if (!dados.nascimento) novosErros.nascimento = 'Data de nascimento é obrigatória';
    if (!dados.naturalidade) novosErros.naturalidade = 'Naturalidade é obrigatória';
    if (!dados.escolar) novosErros.escolar = 'Escolaridade é obrigatória';

    if(dados.cursos.length > 0) dados.has_cursos = true
    if(dados.superiores.length > 0) dados.has_superiores = true
    if(dados.profissoes.length > 0) dados.has_profissoes = true

    setErros(novosErros);
    // Se não houver erros, retornar verdadeiro
    return Object.keys(novosErros).length === 0;
  };

  const salvarDadosNoServidor = async () => {
    if(window.confirm('Não nos responsabilizamos pelas informações e dados digitados incorretamente! Deseja enviar?')){
      if (validarCampos()) { // Somente envia se os campos forem válidos
        try {
          const formData = new FormData();
          formData.append('imagem', imagem);
          formData.append('dados', JSON.stringify(dados));

          const resposta = await axios.post('/api/salvar-dados/?' + id, formData);
          console.log('Resposta do servidor:', resposta.data);

          setExibirPagina2(true);
        } catch (error) {
          alert('Erro ao salvar dados no servidor: ' + error);
        }
      } else {
        alert('Preencha todos os campos obrigatórios.');
      }
    }
  };

  const options_civil = [
    'SOLTEIRO(A)',
    'CASADO(A)',
    'SEPARADO(A)',
    'DIVORCIADA(A)',
    'VIÚVO(A)',
  ];

  const options = [
    'MÉDIO COMPLETO',
    'MÉDIO CURSANDO',
    'MÉDIO INCOMPLETO',
    'FUNDAMENTAL COMPLETO',
    'FUNDAMENTAL CURSANDO',
    'FUNDAMENTAL INCOMPLETO',
  ];

  if (exibirPagina2) {
    return <Finished />;
  }

  return (
    <div>
      <div
        style={{
          padding: '8px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.3)',
          fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        }}
      >
        <h2>Dados Pessoais</h2>

        <label className='label'>Nome:
          <input
            type="text"
            value={dados.nome}
            placeholder='Digite seu nome aqui'
            onChange={(e) => handleChange('nome', e.target.value.toUpperCase())}
            className={`inputs ${erros.nome ? 'error' : ''}`}
          />
          {erros.nome && <span className='error-text'>{erros.nome}</span>}
        </label>

        <label className='label'>Endereço:
          <input
            type="text"
            value={dados.endereco}
            placeholder='Digite seu endereço aqui'
            onChange={(e) => handleChange('endereco', e.target.value.toUpperCase())}
            className={`inputs ${erros.endereco ? 'error' : ''}`}
          />
          {erros.endereco && <span className='error-text'>{erros.endereco}</span>}
        </label>

        <label className='label'>Município:
          <input
            type="text"
            value={dados.municipio}
            placeholder='Digite seu município aqui'
            onChange={(e) => handleChange('municipio', e.target.value.toUpperCase())}
            className={`inputs ${erros.municipio ? 'error' : ''}`}
          />
          {erros.municipio && <span className='error-text'>{erros.municipio}</span>}
        </label>

        <label className='label'>Telefone:
          <input
            type="text"
            value={dados.telefone}
            placeholder='Digite seu telefone aqui'
            onChange={(e) => handleChange('telefone', e.target.value.toUpperCase())}
            className={`inputs ${erros.telefone ? 'error' : ''}`}
          />
          {erros.telefone && <span className='error-text'>{erros.telefone}</span>}
        </label>

        <label className='label' htmlFor="comboBox">Estado civil:
          <select
            id="comboBox"
            value={dados.civil}
            onChange={(e) => handleChange('civil', e.target.value)}
            className={`inputs ${erros.civil ? 'error' : ''}`}
          >
            <option value="" disabled hidden>Selecione...</option>
            {options_civil.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {erros.civil && <span className='error-text'>{erros.civil}</span>}
        </label>

        <label className='label'>Data de Nascimento:
          <input
            type="date"
            value={dados.nascimento}
            onChange={(e) => handleChange('nascimento', e.target.value)}
            className={`inputs ${erros.nascimento ? 'error' : ''}`}
          />
          {erros.nascimento && <span className='error-text'>{erros.nascimento}</span>}
        </label>

        <label className='label'>Naturalidade:
          <input
            type="text"
            value={dados.naturalidade}
            placeholder='Onde você nasceu'
            onChange={(e) => handleChange('naturalidade', e.target.value.toUpperCase())}
            className={`inputs ${erros.naturalidade ? 'error' : ''}`}
          />
          {erros.naturalidade && <span className='error-text'>{erros.naturalidade}</span>}
        </label>

        <label className='label' htmlFor="comboBox">Escolaridade:
          <select
            id="comboBox"
            value={dados.escolar}
            onChange={(e) => handleChange('escolar', e.target.value)}
            className={`inputs ${erros.escolar ? 'error' : ''}`}
          >
            <option value="" disabled hidden>Selecione...</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {erros.escolar && <span className='error-text'>{erros.escolar}</span>}
        </label>

      </div>

      <div>
        <SuperioresForm setDados={setDados} />
        <CursosForm setDados={setDados} />
        <ProfissoesForm setDados={setDados} />
      </div>

      <button
        style={{ marginTop: '20px' }}
        onClick={salvarDadosNoServidor}
      >
        Gerar Currículo
      </button>
    </div>
  );
};

export default AlgumComponente;
