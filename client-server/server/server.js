const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

const {adicionarId} = require('./gerarId')

app.use(express.static(path.join(__dirname, '../build')));


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const dir = './server/uploads';

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
  console.log(`Diretório ${dir} criado com sucesso.`);
} 

const filePath = path.join(__dirname, 'ids.json');  // Caminho para o arquivo ids.json

// Verifica se o arquivo já existe
if (!fs.existsSync(filePath)) {
  // Se o arquivo não existir, cria-o com um array vazio
  fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
  console.log('Arquivo ids.json criado com um array vazio.');
}

const ids = require("./ids.json")

const dataFolder = path.join(__dirname, 'uploads');

app.use(cors());
app.use(bodyParser.json());


// Rota para listar todos os arquivos JSON na pasta uploads
app.post('/listar-arquivos', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads');
  const { offset = 0, limit = 10, query = ''} = req.body;

  // Lista todos os arquivos na pasta uploads
  fs.readdir(uploadDir, (err, files) => {
      if (err) {
          return res.status(500).json({ error: 'Erro ao listar arquivos.' });
      }
      // Filtrar apenas arquivos JSON e que correspondem a query caso exista
      let jsonFiles = files.filter(file => file.endsWith('.json') && (!query || file.includes(query)));

      // Aplicar paginação
      const paginatedFiles = jsonFiles.slice(offset, offset + limit);

      // Enviar os arquivos paginados para o cliente
      res.json(paginatedFiles);
  });
});

// Rota para adicionar um novo ID ao arquivo
app.post('/add-id', (req, res) => {
  adicionarId();
  const filePath = path.join(__dirname, './ids.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Erro ao ler ids.json:', err);
          res.status(500).send('Erro ao ler o arquivo');
          return;
      }

      res.json(JSON.parse(data));
  });
});

// Endpoint para buscar um arquivo JSON específico
app.post('/uploads', (req, res) => {
  const filename = req.body.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error(`Erro ao ler o arquivo: ${err.message}`);
          return res.status(404).json({ error: 'Arquivo não encontrado' });
      }
      console.log(`Requisitado ${filename}`);
      try {
          const jsonData = JSON.parse(data); 
          res.json(jsonData);
      } catch (jsonError) {
          console.error(`Erro ao analisar JSON: ${jsonError.message}`);
          return res.status(500).json({ error: 'Erro ao analisar JSON' });
      }
  });
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/salvar-dados', upload.single('imagem'), async (req, res) => {
  try {    

    const id = req.query.id;
    if(!id){
      res.status(403).end();
    }else{
      if (!validUserIds.includes(id)) {
        res.status(403).end();
      } 
    }
    console.log('Recebido uma solicitação para /salvar-dados');    
      
    const dados = JSON.parse(req.body.dados);

    const [ano, mes, dia]  = dados.nascimento.split('-');
    dados.nascimento = `${dia}/${mes}/${ano}`;

    const fileName = `CURRICULO_${dados.nome}.json`;
    const filePath = path.join(dataFolder, fileName);

    /*

    // converte arquivos de imagem para base64 e insere no json
    const bufferDaImagem = req.file.buffer;

    Converter o buffer para base64
    const imagemBase64 = bufferDaImagem.toString('base64');

    Adicionar a imagem em base64 aos dados
    dados.foto = imagemBase64;

    */

    fs.writeFileSync(filePath, JSON.stringify(dados, null, 2));

    console.log('Dados salvos no arquivo:', filePath);

    atualizarValidadeSequencia(req.query.id, false)
    res.status(200).send('Dados salvos com sucesso!');
    
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    res.status(500).send('Erro ao salvar dados no servidor');
  }
});
var jsonData = ids
fs.watchFile('./server/ids.json', { interval: 1000 }, (curr, prev) => {
  if (curr.mtime !== prev.mtime) {
    console.log('Arquivo JSON modificado. Atualizando dados do servidor...');
    try {
      const jsonFile = fs.readFileSync('./server/ids.json', 'utf8');
      jsonData = JSON.parse(jsonFile);
      console.log('Dados do servidor atualizados:', jsonData);
      attIds()
    } catch (error) {
      console.error('Erro ao ler e atualizar dados do arquivo JSON:', error);
    }
  }
});
var validUserIds
function attIds(){
  const timestampAtual = Date.now();
  validUserIds = jsonData
    .filter(item => item.valido && item.timestamp >= timestampAtual)
    .map(item => item.sequencia);
}
attIds()

function checkIds(){
  const timestampAtual = Date.now();

  // Filtra as chaves inválidas ou com timestamp expirado
  const chavesExpiradas = jsonData.filter(item => !item.valido || item.timestamp < timestampAtual);

  // Remove as chaves inválidas do array jsonData

  jsonData = jsonData.filter(item => item.valido && item.timestamp >= timestampAtual);

  // Atualiza o arquivo JSON apenas com as chaves válidas
  fs.writeFileSync('./server/ids.json', JSON.stringify(jsonData, null, 2), 'utf8');

  console.log('Chaves expiradas:', chavesExpiradas);
}

function atualizarValidadeSequencia(sequencia, novoValorValido) {
  const index = jsonData.findIndex(item => item.sequencia === sequencia);

  if (index !== -1) {
    jsonData[index].valido = novoValorValido;
    fs.writeFileSync('./server/ids.json', JSON.stringify(jsonData, null, 2), 'utf8');
    console.log(`Valor de 'valido' para a sequência ${sequencia} atualizado para ${novoValorValido}`);
  } else {
    console.log(`Sequência ${sequencia} não encontrada`);
  }
}

// Middleware para verificar se o ID do usuário é válido
const validarIdDoUsuario = (req, res, next) => {  
  const id = req.query.id;
  if(!id){
    res.status(403).end();
  }else{
    console.log("Tentativa de acesso, id: " + id)
    if (validUserIds.includes(id)) {
      // O ID do usuário é válido    
      checkIds()
      next();
       // Continue com o próximo middleware ou rota
    } else {
      // ID do usuário inválido, retorne um erro 403 (Acesso Proibido)
      res.status(403).end();
    }
  }
};

app.get('/api/home', validarIdDoUsuario, (req, res) => {
  // Se o middleware validarIdDoUsuario permitir, este bloco será executado
  res.status(200).json({ message: 'ID do usuário validado com sucesso!' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});


  
app.use(cors({
  methods: 'GET,POST', // HEAD,PUT,PATCH,DELETE
  allowedHeaders: 'Content-Type,Authorization',
}));

app.use((req, res, next) => {
  console.log(`Recebida solicitação para: ${req.method} ${req.url}`);
  next();
});

