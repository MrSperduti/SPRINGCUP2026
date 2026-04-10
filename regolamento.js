document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.querySelector('#pdfTable tbody');
  try {
    const data = await fetch('regolamentoFiles.json', { cache: 'no-store' }).then(r => r.json());
    const files = data.regolamentoFiles || [];
    if (!files.length) {
      tableBody.innerHTML = '<tr><td colspan="2">Nessun regolamento disponibile.</td></tr>';
      return;
    }
    files.forEach(file => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${file.title || file.name || 'Documento'}</td><td><a href="${file.url}" target="_blank" rel="noopener noreferrer">📥 Apri</a></td>`;
      tableBody.appendChild(row);
    });
  } catch {
    tableBody.innerHTML = '<tr><td colspan="2">Errore nel caricamento del regolamento.</td></tr>';
  }
});
