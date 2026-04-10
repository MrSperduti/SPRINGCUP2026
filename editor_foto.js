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
      const previewCell = document.createElement('td');
      const removeCell = document.createElement('td');
      const img = document.createElement('img');
      const removeButton = document.createElement('button');

      nameCell.textContent = file.name;
      img.src = file.url;
      img.alt = file.name;
      img.style.width = '100px';
      img.style.height = '80px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '8px';

      removeButton.textContent = 'Rimuovi';
      removeButton.classList.add('remove-button');

      removeButton.onclick = function() {
        const updatedFiles = files.filter(f => f.name !== file.name);
        localStorage.setItem('fotoFiles', JSON.stringify(updatedFiles));
        renderTable(updatedFiles);
      };

      previewCell.appendChild(img);
      removeCell.appendChild(removeButton);
      row.appendChild(nameCell);
      row.appendChild(previewCell);
      row.appendChild(removeCell);
      tableBody.appendChild(row);
    });
  }

  uploadFileButton.addEventListener('click', function() {
    const file = pdfInput.files[0];
    if (file) {
      const fileName = file.name;
      const fileURL = `https://raw.githubusercontent.com/MrSperduti/springcup2025-/main/${encodeURIComponent(fileName)}`;

      fileDetails = {
        name: fileName,
        url: fileURL,
        type: file.type,
        size: file.size
      };

      previewDati.textContent = `Nome: ${fileName}\nTipo: ${file.type}\nDimensione: ${file.size} bytes`;

      let existingFiles = [];
      if (localStorage.getItem('fotoFiles')) {
        existingFiles = JSON.parse(localStorage.getItem('fotoFiles'));
      }

      const existingFileIndex = existingFiles.findIndex(file => file.name === fileName);
      if (existingFileIndex !== -1) {
        existingFiles[existingFileIndex] = fileDetails;
      } else {
        existingFiles.push(fileDetails);
      }

      localStorage.setItem('fotoFiles', JSON.stringify(existingFiles));
      renderTable(existingFiles);
    } else {
      alert('Seleziona una foto da caricare');
    }
  });

  generateJsonButton.addEventListener('click', function() {
    if (downloadJsonLink) {
      downloadJsonLink.remove();
    }
    const jsonBlob = new Blob([JSON.stringify({fotoFiles: JSON.parse(localStorage.getItem('fotoFiles'))})], {type: 'application/json'});
    const jsonURL = URL.createObjectURL(jsonBlob);

    downloadJsonLink = document.createElement('a');
    downloadJsonLink.href = jsonURL;
    downloadJsonLink.download = 'fotoFiles.json';
    downloadJsonLink.textContent = '📥 Scarica JSON Generato';
    downloadJsonLink.style.display = 'block';
    downloadJsonLink.style.marginTop = '20px';
    document.body.appendChild(downloadJsonLink);
  });

  if (localStorage.getItem('fotoFiles')) {
    renderTable(JSON.parse(localStorage.getItem('fotoFiles')));
  }
});
