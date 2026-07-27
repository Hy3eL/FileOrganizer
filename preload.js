const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    selectFolder: () => ipcRenderer.send("select-folder"),
    onFolderSelected: (callback) => {ipcRenderer.on("folder-selected", (event, path) => callback(path))},
    onPreviewResult: (callback) => {ipcRenderer.on("preview-result", (event, preview) => callback(preview))},
    
    organizeFiles: () => ipcRenderer.send("organize-files"),
    onFilesOrganized: (callback) => {ipcRenderer.on("files-organized", (event, message) => callback(message))}
});