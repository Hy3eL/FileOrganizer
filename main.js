const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");

function CreateWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
        preload: path.join(__dirname, "preload.js")
        }
    });

    win.loadFile("index.html");
}

app.whenReady().then(CreateWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
    });

ipcMain.on("select-folder", async () => {
    const result = await dialog.showOpenDialog({
        properties: ["openDirectory"]
    });

    if (!result.canceled) {
        console.log(result.filePaths[0]);
    }

});
