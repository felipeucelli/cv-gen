# CV-Gen
[![Node](https://img.shields.io/badge/Node.js-20.9.0%2B-blue.svg)](https://nodejs.org/en)

CV-Gen é um sistema desenvolvido para empresas que desejam automatizar a criação de currículos de seus clientes. Ele conta com uma interface web otimizada para dispositivos móveis e uma interface construida em Electron para gerenciar e gerar os currículos, além de permitir a configuração de IPs para servidores remotos.

 ## Funcionalidades

 - **Página Web Responsiva**: Design otimizado para dispositivos móveis, facilitando o uso em smartphones e tablets
 
 - **Interface de Controle**: Interface via Electron para visualizar, gerar currículos e gerenciar configurações.

 - **Configuração de IP do Servidor**: Suporte para configuração e alteração do IP do servidor diretamente na interface.

 ## Requisitos

 - [Node.js](https://nodejs.org/en): Versão 20.9.0 ou superior.

 - **Sistema Operacional**:
    - Interface Electron compatível com Windows 10 ou superior

    - O servidor Node.js pode rodar em qualquer sistema operacional que suporte Node.js.

 ## Instalação

 Para utilizar a aplicação, será necessário instalar as dependências de cada módulo (**client-server** e **desktop-client**) separadamente. Siga as instruções abaixo:

 1. **Instale o Node.js**: Certifique-se de ter o Node.js instalado no sistema.

 2. **Instalação das Dependências**:

    - Acesse a pasta raiz do client-server e execute:
        ```bash
        npm install
        ```
    - Acesse a pasta raiz do desktop-client e execute:
        ```bash
        npm install
        ```
 ## Construção
 ### Servidor Node.js e Página React.js

 1. **Build do Projeto**: Dentro da pasta do client-server, execute:
    ```bash
    npm run build
    ```
    Isso irá gerar a página web otimizada para produção.

2. **Iniciar o Servidor**: Após a construção, inicie o servidor com o comando:

     ```bash
    node server/server.js
    ```
     Por padrão, a aplicação será iniciada na porta `3001`. Caso queira definir uma porta diferente, use:

    ```bash
    PORT=NUMERO_DA_PORTA node server/server.js
    ```
    Para manter o servidor em execução, considere utilizar um gerenciador de processos como [PM2](https://pm2.keymetrics.io/) para maior controle.

 ### Interface Electron

  1. **Build da Interface**: Para construir a aplicação Electron em um arquivo executável (`.exe`), abra a pasta desktop-client e execute:

        ```bash
        npm run build
        ```
        O arquivo será gerado dentro da pasta`desktop-client/dist/`.

## Configuração da Interface

A interface é configurada, por padrão, para conectar ao endereço `localhost:3001`. Para alterar o IP ou porta do servidor:

1. Abra a interface Electron.

2. Clique em "Configurar Servidor".

3. Insira o novo IP e porta no popup que será exibido.

## Utilização da Aplicação

### Gerar Link de Formulário

Com o servidor configurado, clique no botão "**Gerar Link**" na interface Electron. Um link será gerado e exibido, que pode ser usado para acessar o formulário de envio de dados em um navegador.

### Receber Currículos

Após o preenchimento e envio do formulário pelo cliente, clique em "**Atualizar**" na interface para solicitar os currículos enviados ao servidor. Os currículos aparecerão na lista do lado esquerdo da interface.

### Gerar Arquivo .docx

1. Selecione o currículo desejado na lista.

2. Clique no botão "**Gerar Currículo**".

3. Escolha a pasta onde deseja salvar o arquivo `.docx` e confirme

4. O arquivo será gerado e salvo na pasta selecionada.

### Observações

- **ID Único**: O acesso ao formulário exige um ID único, gerado internamente pelo servidor. Cada ID é válido por uma única submissão e expira após 3 horas.

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/en) para o backend e a execução do servidor.

- [React.js](https://react.dev/) para a criação da página web responsiva.

- [Electron.js](https://www.electronjs.org/) para a construção da interface desktop de controle.

- [Docxtemplate](https://docxtemplater.com/) para a geração do arquivo `.docx`.