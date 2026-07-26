function browseFolder()
{
    window.electronAPI.selectFolder();
}
    window.electronAPI.onFolderSelected((path) => {
    document.getElementById("folderPath").textContent = path;
});

window.electronAPI.onPreviewResult((preview) => {
    const container = document.getElementById("preview-result");
    const categories = ["Images", "Documents", "Videos", "Music", "Archives", "Others"];

    for (const category of categories) {

        const title = document.createElement("h3");
        title.textContent = category;

        const count = document.createElement("p");
        count.textContent = `Count: ${preview[category].length}`;

        container.appendChild(title);
        container.appendChild(count);

        for (const file of preview[category]) {
            const fileElement = document.createElement("p");
            fileElement.textContent = file;
            container.appendChild(fileElement);
        }
    }
});