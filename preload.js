const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    selectFolder: () => ipcRenderer.send("select-folder"),

    onFolderSelected: (callback) => {ipcRenderer.on("folder-selected", (event, path) => callback(path))} 
});