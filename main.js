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

ipcMain.on("select-folder", async (event) => {
    const result = await dialog.showOpenDialog({
        properties: ["openDirectory"]
    });

    if (!result.canceled) {
        event.reply("folder-selected", result.filePaths[0]);

        const fs = require("fs");
        fs.readdir(result.filePaths[0], function(err, files){
            if(err) {
                console.log("Error reading directory:" + err);
            } else {
                console.log("Files in directory:" + files);
            }
        

            var Images = [];
            var Documents = [];
            var Videos = [];
            var Music = [];
            var Archives = [];
            var Others = [];

            for (var i = 0; i < files.length; i++) {
                if (files[i].match(/\.(jpg|jpeg|png|gif|bmp|webp|ico|svg|tif|tiff|raw)$/i)) {
                    Images.push(files[i]);
                } else if (files[i].match(/\.(pdf|doc|docx|txt|rtf|odt|xls|ppt|xlsx|csv|ods|pptx|odp|md|xml|json|yaml|yml|tex)$/i)) {
                    Documents.push(files[i]);
                } else if (files[i].match(/\.(mp4|avi|mov|mkv|wmv|flv|webm|m4v|mpg|ts|mpeg|3gp|m2ts|vob)$/i)) {
                    Videos.push(files[i]);
                } else if (files[i].match(/\.(mp3|wav|flac|aac|m4a|ogg|wma|aiff|alac|mid|midi|amr)$/i)) {
                    Music.push(files[i]);
                } else if (files[i].match(/\.(zip|rar|tar|gz|7z|bz2|xz|iso|cab|z)$/i)) {
                    Archives.push(files[i]);
                } else {
                    Others.push(files[i]);
                }
            }

            const preview = {
                Images,
                Documents,
                Videos,
                Music,
                Archives,
                Others
            };
            event.reply("preview-result", preview);
        })
    }
});
