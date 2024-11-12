import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainForm from '../components/MainForm';
import Error403Page from '../components/Error403Page';

const Home = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [erro, setErro] = useState(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    const verificarIdDoUsuario = async () => {
      try {

        const response = await axios.get(`/api/home/?${id}`, {
          timeout: 3000,
        });

        if (response.status === 200) {
          setCarregado(true); 
          console.log('Resposta do servidor:', response.data);
        } else {
          setErro({ response });
        }
      } catch (error) {
        console.log('Erro ao verificar ID do usuário:', error);
        setErro(error); // Define o erro para tratamento posterior
      }
    };

    verificarIdDoUsuario();
  }, [id, navigate]);

  // Se houver um erro, renderize a página de erro
  if (erro) {
    if (erro.response && erro.response.status === 403) {
      return <Error403Page />;
    } else if (erro.message === 'Network Error') {
      // Se houver um erro de rede, exibe uma mensagem apropriada
      return <div>Erro de rede. Verifique se o backend está rodando.</div>;
    } else {
      return <div>Ocorreu um erro. Tente novamente.</div>;
    }
  }

  // Só renderiza o MainForm se o servidor retornar status 200
  if (!carregado) {
    return <div>Carregando...</div>; // Mostra um carregamento até que o servidor responda
  }

  return (
    <div>
      <MainForm />
    </div>
  );
};

export default Home;
