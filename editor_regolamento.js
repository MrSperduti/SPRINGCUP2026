document.addEventListener("DOMContentLoaded", function() {
  const pdfInput = document.getElementById("pdfInput");
  const uploadFileButton = document.getElementById("uploadFileButton");
  const generateJsonButton = document.getElementById("generateJsonButton");
  const tableBody = document.querySelector('#pdfTable tbody');
  const previewDati = document.getElementById('previewDati');
  let fileDetails = null;
  let downloadJsonLink = null;

  function renderTable(files) {
    tableBody.innerHTML = '';
    files.forEach(file => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const downloadCell = document.createElement('td');
      const removeCell = document.createElement('td');
      const downloadLink = document.createElement('a');
      const removeButton = document.createElement('button');

      nameCell.textContent = file.name;
      downloadLink.href = file.url;
      downloadLink.innerHTML = '📥 Scarica';
      downloadLink.download = file.name;
      removeButton.textContent = 'Rimuovi';
      removeButton.classList.add('remove-button');

      removeButton.onclick = function() {
        const updatedFiles = files.filter(f => f.name !== file.name);
        localStorage.setItem('regolamentoFiles', JSON.stringify(updatedFiles));
        renderTable(updatedFiles);
      };

      downloadCell.appendChild(downloadLink);
      removeCell.appendChild(removeButton);
      row.appendChild(nameCell);
      row.appendChild(downloadCell);
      row.appendChild(removeCell);
      tableBody.appendChild(row);
    });
  }

  uploadFileButton.addEventListener('click', function() {
    const file = pdfInput.files[0];
    if (file) {
      const fileName = file.name;
      const fileURL = `https://raw.githubusercontent.com/MrSperduti/springcup2025-/main/${fileName}`;

      fileDetails = {
        name: fileName,
        url: fileURL,
        type: file.type,
        size: file.size
      };

      previewDati.textContent = `Nome: ${fileName}\nTipo: ${file.type}\nDimensione: ${file.size} bytes`;

      let existingFiles = [];
      if (localStorage.getItem('regolamentoFiles')) {
        existingFiles = JSON.parse(localStorage.getItem('regolamentoFiles'));
      }

      const existingFileIndex = existingFiles.findIndex(file => file.name === fileName);
      if (existingFileIndex !== -1) {
        existingFiles[existingFileIndex] = fileDetails;
      } else {
        existingFiles.push(fileDetails);
      }

      localStorage.setItem('regolamentoFiles', JSON.stringify(existingFiles));
      renderTable(existingFiles);
    } else {
      alert('Seleziona un file da caricare');
    }
  });

  generateJsonButton.addEventListener('click', function() {
    if (downloadJsonLink) {
      downloadJsonLink.remove();
    }
    const jsonBlob = new Blob([JSON.stringify({regolamentoFiles: JSON.parse(localStorage.getItem('regolamentoFiles'))})], {type: 'application/json'});
    const jsonURL = URL.createObjectURL(jsonBlob);

    downloadJsonLink = document.createElement('a');
    downloadJsonLink.href = jsonURL;
    downloadJsonLink.download = 'regolamentoFiles.json';
    downloadJsonLink.textContent = '📥 Scarica JSON Generato';
    downloadJsonLink.style.display = 'block';
    downloadJsonLink.style.marginTop = '20px';
    document.body.appendChild(downloadJsonLink);
  });

  if (localStorage.getItem('regolamentoFiles')) {
    renderTable(JSON.parse(localStorage.getItem('regolamentoFiles')));
  }
});
