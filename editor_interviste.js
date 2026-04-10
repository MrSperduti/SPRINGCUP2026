document.addEventListener("DOMContentLoaded", function() {
  const intervistaInput = document.getElementById("intervistaInput");
  const descriptionInput = document.getElementById("descriptionInput");
  const uploadFileButton = document.getElementById("uploadFileButton");
  const generateJsonButton = document.getElementById("generateJsonButton");
  const tableBody = document.querySelector('#intervistaTable tbody');
  const previewDati = document.getElementById('previewDati');
  let downloadJsonLink = null;

  function renderTable(files) {
    tableBody.innerHTML = '';
    files.forEach(file => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const previewCell = document.createElement('td');
      const removeCell = document.createElement('td');
      const video = document.createElement('video');
      const removeButton = document.createElement('button');

      nameCell.textContent = file.description || file.name;
      video.src = file.url;
      video.controls = true;
      video.style.width = '100px';
      video.style.height = '80px';

      removeButton.textContent = 'Rimuovi';
      removeButton.classList.add('remove-button');
      removeButton.onclick = function() {
        const updatedFiles = files.filter(f => f.name !== file.name);
        localStorage.setItem('intervisteFiles', JSON.stringify(updatedFiles));
        renderTable(updatedFiles);
      };

      previewCell.appendChild(video);
      removeCell.appendChild(removeButton);
      row.appendChild(nameCell);
      row.appendChild(previewCell);
      row.appendChild(removeCell);
      tableBody.appendChild(row);
    });
  }

  uploadFileButton.addEventListener('click', function() {
    const files = intervistaInput.files;
    const description = descriptionInput.value.trim();

    if (files.length > 0) {
      let existingFiles = [];
      if (localStorage.getItem('intervisteFiles')) {
        existingFiles = JSON.parse(localStorage.getItem('intervisteFiles'));
      }

      Array.from(files).forEach(file => {
        const fileName = file.name;
        const fileURL = `https://raw.githubusercontent.com/MrSperduti/springcup2025-/main/${encodeURIComponent(fileName)}`;

        const fileDetails = {
          name: fileName,
          url: fileURL,
          type: file.type,
          size: file.size,
          description: description
        };

        const existingFileIndex = existingFiles.findIndex(f => f.name === fileName);
        if (existingFileIndex !== -1) {
          existingFiles[existingFileIndex] = fileDetails;
        } else {
          existingFiles.push(fileDetails);
        }
      });

      localStorage.setItem('intervisteFiles', JSON.stringify(existingFiles));
      renderTable(existingFiles);

      previewDati.textContent = `Caricate ${files.length} interviste.`;
    } else {
      alert('Seleziona almeno un file da caricare');
    }
  });

  generateJsonButton.addEventListener('click', function() {
    if (downloadJsonLink) {
      downloadJsonLink.remove();
    }
    const jsonBlob = new Blob([JSON.stringify({intervisteFiles: JSON.parse(localStorage.getItem('intervisteFiles'))})], {type: 'application/json'});
    const jsonURL = URL.createObjectURL(jsonBlob);

    downloadJsonLink = document.createElement('a');
    downloadJsonLink.href = jsonURL;
    downloadJsonLink.download = 'intervisteFiles.json';
    downloadJsonLink.textContent = '📥 Scarica JSON Generato';
    downloadJsonLink.style.display = 'block';
    downloadJsonLink.style.marginTop = '20px';
    document.body.appendChild(downloadJsonLink);
  });

  if (localStorage.getItem('intervisteFiles')) {
    renderTable(JSON.parse(localStorage.getItem('intervisteFiles')));
  }
});