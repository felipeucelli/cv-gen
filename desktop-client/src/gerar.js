const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');

function generateResume(data, directory){
   
    let content;
    // Carregar o template.docx estilizado
    try{
       content = fs.readFileSync('resources/app/src/templates/template.docx', 'binary');
    }catch (e){
      console.log("Não foi possivel encontrar o caminho resources/app/src/templates/template.docx. Mudando para o diretorio padrão")
       content = fs.readFileSync('./src/templates/template.docx', 'binary');
    }
    

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);
    
    // Definir os dados que serão usados no template
    doc.setData(data);
    
    try {
        // Renderizar o template com os dados
        doc.render();
    } catch (error) {
        console.error(error);
    }
    
    // Salvar o documento gerado
    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(`${directory}/CURRICULO_${data.nome}.docx`, buf);
}

module.exports = {
    generateResume
  };

