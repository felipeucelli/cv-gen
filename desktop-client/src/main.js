const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { generateResume } = require('./gerar');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        icon: path.join(__dirname, 'images/icon.png'),
        autoHideMenuBar: true, // desabilita barra de menu
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Preload correto
            contextIsolation: true,   // ContextIsolation ativado
            nodeIntegration: false,   // NodeIntegration desativado
            enableRemoteModule: false // Segurança adicional            
        }
    });

    mainWindow.loadFile('src/index.html');
}

function createConfigWindow() {
    const configWindow = new BrowserWindow({
        width: 400,
        height: 400,
        parent: mainWindow,
        modal: true,
        resizable: false,
        autoHideMenuBar: true, // desabilita barra de menu
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false
        }
    });

    configWindow.loadFile('src/config.html');
}

app.whenReady().then(() => {
    createWindow();

    // Abrir popup de configuração
    ipcMain.on('open-config-window', () => {
        createConfigWindow();
    });

    ipcMain.on('reload', (event) => {
        mainWindow.close();
        createWindow();
    })

    // Salvar configurações
    ipcMain.on('save-server-config', (event, configData) => {
        const configFilePath = 'resources/app/config.json';

        fs.writeFile(configFilePath, JSON.stringify(configData, null, 2), (err) => {
            if (err) {
                console.log('Não foi possivel encontrar o caminho resources/app/config.json. Mudando para diretorio padrão')
                fs.writeFile('config.json', JSON.stringify(configData, null, 2), (err) => {
                    if (err) {
                        console.error('Erro ao salvar configurações:', err);
                        event.sender.send('config-saved', { status: 'error' });
                    };
                });
            } 
            console.log('Configurações salvas:', configData);
            event.sender.send('config-saved', { status: 'success' });
            
        });
    });

    // Carregar arquivos da pasta
    ipcMain.on('load-files', (event) => {
        const filesDir = 'files';

        fs.readdir(filesDir, (err, files) => {
            if (err) {
                console.error('Erro ao ler a pasta files:', err);
                event.sender.send('file-list', []);
                return;
            }

            const jsonFiles = files.filter(file => file.endsWith('.json'));
            event.sender.send('file-list', jsonFiles);
        });
    });


    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});


// Função para enviar o JSON completo do arquivo selecionado
ipcMain.on('request-json-file', (event, fileName) => {
    const filePath = path.join('files', fileName);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err);
            return;
        }
        // Enviar o conteúdo do JSON de volta para o renderer
        event.sender.send('json-file-data', JSON.parse(data));
    });
});

// Função para ler arquivos
ipcMain.handle('read-file', async (event, filePath) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
        return data;
    } catch (err) {
        console.error('Erro ao ler o arquivo:', err);
        throw err;
    }
});

// Função para salvar o IP em arquivo
ipcMain.handle('save-file', async (event, filePath, content) => {
    try {
        fs.writeFileSync(path.join(__dirname, filePath), content, 'utf8');
        return true;
    } catch (err) {
        console.error('Erro ao salvar o arquivo:', err);
        throw err;
    }
});

// Função para abrir o seletor de diretórios
ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    return result.filePaths[0];
});

// Função para gerar currículo
ipcMain.handle('generate-resume', async (event, fileData, directory) => {
    try {
        const result = generateResume(fileData, directory); // Chama a função com os dados recebidos
        return result; // Retorna o caminho do currículo gerado
    } catch (error) {
        console.error('Erro ao gerar o currículo:', error);
        throw error;
    }
});

// Função para abrir a pasta
ipcMain.handle('open-directory', async (event, directory) => {
    shell.openPath(directory);
});