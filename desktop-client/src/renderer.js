let serverIp = 'localhost:3001'
let offset = 0; // Deslocamento inicial
const limit = 10; // Quantidade de itens por requisição
let loading = false; // Controle de estado para evitar múltiplas requisições
let selectedJsonData = null; // Variável para armazenar o JSON do arquivo selecionado
let selectedJson = null; // Variável que armazenará os dados JSON
let pasta = ''
let query;

// Ação para o botão de configurar servidor
document.getElementById('configurar').addEventListener('click', () => {
    window.electronAPI.send('open-config-window');
});

// Ação para gerar currículo
document.getElementById('gerar-curriculo').addEventListener('click', () => {
    window.electronAPI.send('generate-curriculum');
});

// Ação para gerar link
document.getElementById('gerar-link').addEventListener('click', () => {
    window.electronAPI.send('generate-link');
});

const jsonList = document.getElementById('jsonList'); // Pega o elemento HTML que exibirá os arquivos json

/*
// Realiza a pesquisa dinamica sempre que o usuario digitar
document.getElementById('search').addEventListener('input', (event) => {
    const termo = event.target.value.trim();
    if (termo.length > 0) {
        pesquisarArquivos(termo);
    } else {
        limparListaArquivos();
        carregarArquivosDoServidor();  // Carrega os arquivos normais se o campo de pesquisa estiver vazio
    }
});
*/

// Receber confirmação do salvamento de configuração
window.electronAPI.receive('config-saved', (response) => {
    if (response.status === 'success') {
        alert('Configurações salvas com sucesso!');
    } else {
        alert('Erro ao salvar configurações.');
    }
});

// Exibir arquivos do servidor na interface
window.electronAPI.receive('server-files', (arquivos) => {
    if (arquivos.length > 0) {
        exibirArquivosNaInterface(arquivos);
    } else {
        console.error("Nenhum arquivo encontrado no servidor.");
    }
});

// Exibir arquivos na interface
function exibirArquivosNaInterface(arquivos) {
    //jsonList.innerHTML = ''; // Limpar o conteúdo anterior
    arquivos.forEach((arquivo) => {
        const fileItem = document.createElement('div');
        fileItem.textContent = arquivo.replace('.json', '');
        fileItem.classList.add('file-item');
        fileItem.addEventListener('click', () => {
            document.getElementById('gerar-curriculo').disabled = false; // Habilitar o botão ao selecionar o arquivo
        buscarArquivoJson(arquivo); // Buscar o JSON ao selecionar o arquivo
        destacarArquivoSelecionado(fileItem);
        });
        jsonList.appendChild(fileItem);

    });
}

// Ação para gerar link
document.getElementById('gerar-link').addEventListener('click', () => {
    // Requisição para executar a função add() no servidor
    fetch(`http://${serverIp}/add-id`, {
        method: "post"
    })
        .then(response => response.json())
        .then(data => {
            const lastIndex = data[data.length - 1]; // Pega o último index do array
            if (lastIndex.valido) {
                const link = `http://${serverIp}/id=${lastIndex.sequencia}`;
                document.getElementById('link-gerado').textContent = link; // Exibir o link gerado
            }
        })
        .catch(error => {
            console.error('Erro ao gerar o link:', error);
        });
});

// Função para solicitar ao usuário a pasta onde salvar o currículo
function solicitarPasta() {
    return window.api.selectDirectory()
        .then(directoryPath => {
            if (!directoryPath) {
                throw new Error('Nenhuma pasta selecionada');
            }
            pasta = directoryPath;
            return directoryPath;
        });
}

// Função de geração de currículo e solicitar a pasta
document.getElementById('gerar-curriculo').addEventListener('click', () => {
    if (selectedJson) {
        solicitarPasta()
            .then(pasta => {
                return window.api.generateResume(selectedJson, pasta);
            })
            .then(() => {
                // Mostrar popup perguntando se o usuário quer abrir a pasta
                if (confirm('Currículo gerado! Deseja abrir a pasta?')) {
                    window.api.openDirectory(pasta);
                }
            })
            .catch(err => {
                console.error('Erro ao gerar o currículo:', err);
            });
    }
});

// Função que atualiza o JSON selecionado
function selectJsonFile(json) {
    selectedJson = json;
}

function carregarArquivosDoServidor() {
    if (loading) return; // Impede carregamento simultâneo
    loading = true;

    if(query && !offset){
        offset = 10
    }

    fetch(`http://${serverIp}/listar-arquivos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offset, limit, query }), // Envia o offset, limite e query
    })
    .then(response => response.json())
    .then(arquivos => {
        if (arquivos.length > 0) {
            exibirArquivosNaInterface(arquivos);
            offset += limit; // Atualiza o deslocamento para o próximo bloco
        }
        loading = false; // Libera o estado de carregamento
    })
    .catch(error => {
        console.error('Erro ao carregar arquivos do servidor:', error);
        loading = false; // Libera o estado de carregamento mesmo em caso de erro
    });
}

jsonList.addEventListener('scroll', () => {
    if (jsonList.scrollTop + jsonList.clientHeight >= jsonList.scrollHeight) {
        carregarArquivosDoServidor(); // Carrega mais arquivos quando chegar ao final
    }
});

function pesquisarArquivos(termo) {
    query = termo
    fetch(`http://${serverIp}/listar-arquivos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
    })
    .then(response => response.json())
    .then(arquivos => {
        // Limpar a interface e exibir os arquivos correspondentes à pesquisa
        limparListaArquivos(); 
        exibirArquivosNaInterface(arquivos);
    })
    .catch(error => {
        console.error('Erro ao pesquisar arquivos:', error);
    });
}

// Evento para buscar ao pressionar Enter ou clicar no botão de pesquisa
document.getElementById('search').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const termo = event.target.value.trim().toUpperCase();
        if (termo.length > 0) {
            pesquisarArquivos(termo);
        } else {
            query = '';
            limparListaArquivos();
            carregarArquivosDoServidor();
        }
    }
});

document.getElementById('search-btn').addEventListener('click', () => {
    const termo = document.getElementById('search').value.trim().toUpperCase();
    if (termo.length > 0) {
        pesquisarArquivos(termo);
    } else {
        query = '';
        limparListaArquivos();
        carregarArquivosDoServidor();
    }
});

// Funções do botão atualizar
document.getElementById('refresh').addEventListener('click', () => {  
    document.getElementById('search').value = ''
    query = ''  
    limparListaArquivos()
    carregarArquivosDoServidor()
});

// Função para buscar um arquivo JSON e armazenar seus dados
function buscarArquivoJson(nomeArquivo) {
    fetch(`http://${serverIp}/uploads`, {
        method: "post",
        body: JSON.stringify({ "filename": nomeArquivo }),
        headers: { "Content-Type": "application/json" },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar o arquivo: ${response.statusText}`);
            }
            return response.json(); // Retorna o conteúdo do arquivo como JSON
        })
        .then(data => {
            selectJsonFile(data); // Armazenar os dados JSON na variável
            console.log("Arquivo JSON carregado:", selectedJsonData);
        })
        .catch(error => {
            console.error('Erro ao ler o arquivo JSON:', error);
        });
}


function limparListaArquivos() {
    offset = 0
    jsonList.innerHTML = '';  // Limpa a lista atual
}

// Função para destacar o arquivo selecionado
function destacarArquivoSelecionado(fileItem) {
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.style.backgroundColor = ''; // Limpar destaque dos outros arquivos
    });
    fileItem.style.backgroundColor = '#E0E0E0'; // Destacar o arquivo selecionado
}


function carregarIpConfiguracao() {
    window.api.readFile('../config.json')
        .then(data => {
            const config = JSON.parse(data);
            serverIp = config.ip || 'localhost:3001';
            document.getElementById('configurar').textContent = `Configurar Servidor (${serverIp})`;
            // Carregar arquivos ao iniciar
            carregarArquivosDoServidor();
        })
        .catch(err => {
            console.error('Erro ao carregar configuração:', err);
        });
}

carregarIpConfiguracao();
