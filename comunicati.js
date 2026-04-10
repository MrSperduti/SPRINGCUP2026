document.addEventListener("DOMContentLoaded", function() {
  const tableBody = document.querySelector('#pdfTable tbody');

  fetch('https://raw.githubusercontent.com/MrSperduti/springcup2025-/main/comunicatiFiles.json')
    .then(response => response.json())
    .then(data => {
      data.comunicatiFiles.forEach((file, index) => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const downloadCell = document.createElement('td');
        const downloadLink = document.createElement('a');

        nameCell.textContent = 'Comunicato n.' + (index + 1);
        downloadLink.href = file.url;
        downloadLink.innerHTML = '📥 Scarica';
        downloadLink.download = file.name;

        downloadCell.appendChild(downloadLink);
        row.appendChild(nameCell);
        row.appendChild(downloadCell);
        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Errore durante il caricamento dei file:', error);
    });
});
