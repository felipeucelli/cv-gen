const fs = require('fs');

function gerarId() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let sequencia = '';

  // Gera a sequência alfanumérica aleatória
  for (let i = 0; i < 10; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    sequencia += caracteres.charAt(indice);
  }

  return sequencia;
}

function adicionarId() {
  let jsonData = [];

  // Tenta ler o arquivo JSON existente
  try {
    const jsonFile = fs.readFileSync('./server/ids.json', 'utf8');
    jsonData = JSON.parse(jsonFile);
  } catch (error) {
    // Se o arquivo não existir, será criado mais tarde
  }

  let novaSequencia;

  // Garante que a nova sequência seja única
  do {
    novaSequencia = gerarId();
  } while (jsonData.some(item => item.sequencia === novaSequencia));

  // Calcula o timestamp atual mais 3 horas em milissegundos
  const timestampMaisTresHoras = Date.now() + 3 * 60 * 60 * 1000;

  // Adiciona a nova sequência ao array JSON com as chaves "sequencia", "valido" e "timestamp"
  jsonData.push({ sequencia: novaSequencia, valido: true, timestamp: timestampMaisTresHoras });

  // Salva o array JSON atualizado no arquivo
  fs.writeFileSync('./server/ids.json', JSON.stringify(jsonData, null, 2), 'utf8');

  console.log('ID adicionada ao JSON:', novaSequencia);
}

module.exports = {
  adicionarId
};