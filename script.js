function browseFolder()
{
    window.electronAPI.selectFolder();
    window.electronAPI.onFolderSelected((path) => {
        document.getElementById("folderPath").textContent = path;
    });
}