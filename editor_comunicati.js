document.addEventListener("DOMContentLoaded", function () {
  const pdfInput = document.getElementById("pdfInput");
  const uploadFileButton = document.getElementById("uploadFileButton");
  const generateJsonButton = document.getElementById("generateJsonButton");
  const tableBody = document.querySelector("#pdfTable tbody");
  const previewDati = document.getElementById("previewDati");
  const jsonDownloadContainer = document.getElementById("jsonDownloadContainer");

  let downloadJsonLink = null;

  function getStoredFiles() {
    try {
      return JSON.parse(localStorage.getItem("comunicatiFiles")) || [];
    } catch (error) {
      return [];
    }
  }

  function setStoredFiles(files) {
    localStorage.setItem("comunicatiFiles", JSON.stringify(files));
  }

  function renderTable(files) {
    tableBody.innerHTML = "";

    if (!files.length) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="3">Nessun file caricato.</td>`;
      tableBody.appendChild(row);
      return;
    }

    files.forEach((file) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      const downloadCell = document.createElement("td");
      const removeCell = document.createElement("td");

      const downloadLink = document.createElement("a");
      downloadLink.href = file.url;
      downloadLink.textContent = "📥 Scarica";
      downloadLink.download = file.name;
      downloadLink.target = "_blank";
      downloadLink.rel = "noopener noreferrer";

      const removeButton = document.createElement("a");
      removeButton.href = "#";
      removeButton.className = "btn secondary";
      removeButton.textContent = "🗑️ Rimuovi";
      removeButton.onclick = function (e) {
        e.preventDefault();
        const updatedFiles = getStoredFiles().filter((f) => f.name !== file.name);
        setStoredFiles(updatedFiles);
        renderTable(updatedFiles);
      };

      nameCell.textContent = file.name;
      downloadCell.appendChild(downloadLink);
      removeCell.appendChild(removeButton);

      row.appendChild(nameCell);
      row.appendChild(downloadCell);
      row.appendChild(removeCell);

      tableBody.appendChild(row);
    });
  }

  uploadFileButton.addEventListener("click", function (e) {
    e.preventDefault();

    const file = pdfInput.files[0];
    if (!file) {
      alert("Seleziona un file da caricare");
      return;
    }

    const fileName = file.name;
    const fileURL = `https://raw.githubusercontent.com/MrSperduti/SPRINGCUP2026/main/${encodeURIComponent(fileName)}`;

    const fileDetails = {
      name: fileName,
      url: fileURL,
      type: file.type,
      size: file.size
    };

    previewDati.textContent =
      `Nome: ${fileName}\n` +
      `Tipo: ${file.type || "non disponibile"}\n` +
      `Dimensione: ${file.size} bytes\n` +
      `URL: ${fileURL}`;

    const existingFiles = getStoredFiles();
    const existingFileIndex = existingFiles.findIndex((f) => f.name === fileName);

    if (existingFileIndex !== -1) {
      existingFiles[existingFileIndex] = fileDetails;
    } else {
      existingFiles.push(fileDetails);
    }

    setStoredFiles(existingFiles);
    renderTable(existingFiles);
  });

  generateJsonButton.addEventListener("click", function (e) {
    e.preventDefault();

    if (downloadJsonLink) {
      downloadJsonLink.remove();
      downloadJsonLink = null;
    }

    const files = getStoredFiles();
    const jsonBlob = new Blob(
      [JSON.stringify({ comunicatiFiles: files }, null, 2)],
      { type: "application/json" }
    );
    const jsonURL = URL.createObjectURL(jsonBlob);

    downloadJsonLink = document.createElement("a");
    downloadJsonLink.href = jsonURL;
    downloadJsonLink.download = "comunicatiFiles.json";
    downloadJsonLink.className = "btn";
    downloadJsonLink.textContent = "📥 Scarica JSON Generato";

    jsonDownloadContainer.innerHTML = "";
    jsonDownloadContainer.appendChild(downloadJsonLink);
  });

  renderTable(getStoredFiles());
});
