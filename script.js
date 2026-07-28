function browseFolder()
{
    window.electronAPI.selectFolder();
}
    window.electronAPI.onFolderSelected((path) => {
    const folder = document.getElementById("folderPath");

    folder.textContent = path;
    folder.classList.add("selected");
});

window.electronAPI.onPreviewResult((preview) => {
    const container = document.getElementById("preview-result");
    container.innerHTML = "";
    const categories = ["Images", "Documents", "Videos", "Music", "Archives", "Others"];

    for (const category of categories) {

        const count = document.createElement("p");
        count.textContent = `Count: ${preview[category].length}`;
        
        const title = document.createElement("h3");
        title.textContent = category;

        if (preview[category].length === 0) 
            continue;;

        container.appendChild(title);
        container.appendChild(count);

        for (const file of preview[category]) {
            const fileElement = document.createElement("p");
            fileElement.textContent = file;
            container.appendChild(fileElement);
        }
    }
});

window.electronAPI.onFilesOrganized((message) => {
        const outcome = document.getElementById("organization-outcome");
        outcome.textContent = message;
        outcome.style.visibility = "visible";
});

function organizeFiles()
{
    window.electronAPI.organizeFiles();
}