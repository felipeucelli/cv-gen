const { contextBridge, ipcRenderer } = require('electron');

// Expor métodos seguros ao renderer
contextBridge.exposeInMainWorld('electronAPI', {
    send: (channel, data) => {
        const validChannels = [
            'open-config-window', 
            'save-server-config', 
            'load-files', 
            'fetch-server-files', 
            'request-json-file', 
            'open-folder',
            'generate-resume',
            'reload'
        ];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        const validChannels = ['config-saved', 'file-list', 'server-files', 'json-file-data', 'generate-resume','reload'];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});

contextBridge.exposeInMainWorld('api', {
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
    selectDirectory: () => ipcRenderer.invoke('select-directory'),
    generateResume: (fileData, directory) => ipcRenderer.invoke('generate-resume', fileData, directory),
    openDirectory: (directory) => ipcRenderer.invoke('open-directory', directory)    
});
