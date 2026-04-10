document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.querySelector('#pdfTable tbody');
  try {
    const data = await fetch('comunicatiFiles.json', { cache: 'no-store' }).then(r => r.json());
    const files = data.comunicatiFiles || [];
    if (!files.length) {
      tableBody.innerHTML = '<tr><td colspan="2">Nessun comunicato disponibile.</td></tr>';
      return;
    }
    files.forEach((file, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${file.title || ('Comunicato n. ' + (index + 1))}</td><td><a href="${file.url}" target="_blank" rel="noopener noreferrer">📥 Apri</a></td>`;
      tableBody.appendChild(row);
    });
  } catch {
    tableBody.innerHTML = '<tr><td colspan="2">Errore nel caricamento dei comunicati.</td></tr>';
  }
});
