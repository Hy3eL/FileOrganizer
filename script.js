function browseFolder()
{
    window.electronAPI.selectFolder();
}
    window.electronAPI.onFolderSelected((path) => {
    document.getElementById("folderPath").textContent = path;
});

window.electronAPI.onPreviewResult((preview) => {
    document.getElementById("preview-result").textContent =
        JSON.stringify(preview);
});