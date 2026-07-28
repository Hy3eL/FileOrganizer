const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
let selectedFolderPath;


function CreateWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 700,
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

        fs.readdir(result.filePaths[0], function(err, files){
            if(err) {
                console.log("Error reading directory:" + err);
            }    
            
            selectedFolderPath = result.filePaths[0];

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

ipcMain.on("organize-files", (event) => {

    fs.readdir(selectedFolderPath, function(err, files){
        if(err) {
            console.log(err);
            return;
        }     

        let Images = [];
        let Documents = [];
        let Videos = [];
        let Music = [];
        let Archives = [];
        let Others = [];

        for (var i = 0; i < files.length; i++) {

            const oldPath = path.join(selectedFolderPath, files[i]);
            const stats = fs.statSync(oldPath);

            if (stats.isDirectory()) {
                continue;
            }

            if(files[i].match(/\.(jpg|jpeg|png|gif|bmp|webp|ico|svg|tif|tiff|raw)$/i)) {
                Images.push(files[i]);
            }
            else if(files[i].match(/\.(pdf|doc|docx|txt|rtf|odt|xls|ppt|xlsx|csv|ods|pptx|odp|md|xml|json|yaml|yml|tex)$/i)) {
                Documents.push(files[i]);
            }
            else if(files[i].match(/\.(mp4|avi|mov|mkv|wmv|flv|webm|m4v|mpg|ts|mpeg|3gp|m2ts|vob)$/i)) {
                Videos.push(files[i]);
            }
            else if(files[i].match(/\.(mp3|wav|flac|aac|m4a|ogg|wma|aiff|alac|mid|midi|amr)$/i)) {
                Music.push(files[i]);
            }
            else if(files[i].match(/\.(zip|rar|tar|gz|7z|bz2|xz|iso|cab|z)$/i)) {
                Archives.push(files[i]);
            }
            else {
                Others.push(files[i]);
            }
        
        }
        const folders = {
            Images,
            Documents,
            Videos,
            Music,
            Archives,
            Others
        };
        for (const folder in folders) {

            if (folders[folder].length > 0) {

                const folderPath = path.join(selectedFolderPath, folder);

                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }
            }
        }

            for (const folder in folders) {
                for (const file of folders[folder]) {
                    const oldPath = path.join(selectedFolderPath, file);
                    const newPath = path.join(selectedFolderPath, folder, file);
                    moveFile(oldPath, path.join(selectedFolderPath, folder, file));
                }
            }
    
    event.reply("files-organized", "Files organized successfully!");
 
})
});

function moveFile(oldPath, newPath) {
    try {
        fs.renameSync(oldPath, newPath);
    }
    catch(err) {
        console.log(err);
    }
};
