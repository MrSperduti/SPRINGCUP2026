async function loadCalendar() {
  const cat = new URLSearchParams(location.search).get('categoria');
  const res = await fetch('dati.json');
  const dati = await res.json();
  const div = document.getElementById('calendario');
  div.innerHTML = '';

  const partite = dati[cat]?.partite || [];
  const giornate = {};

  partite.forEach(p => {
    const g = p.giornata || 0;
    if (!giornate[g]) giornate[g] = [];
    giornate[g].push(p);
  });

  Object.keys(giornate).sort((a, b) => a.localeCompare(b, undefined, {numeric: true})).forEach(g => {
    const section = document.createElement('div');
    const titolo = document.createElement('h3');
    titolo.textContent = "Giornata " + g;
    section.appendChild(titolo);

    const table = document.createElement('table');
    table.innerHTML = '<tr><th>Squadra A</th><th>Squadra B</th><th>Data</th><th>Ora</th><th>Campo</th><th>Risultato</th><th>Girone</th></tr>';

    giornate[g].forEach(p => {
      const row = document.createElement('tr');
      const idPartita = `${cat}-${partite.indexOf(p)}`;
      const risultato = (p.golA != null && p.golB != null) ? `${p.golA} - ${p.golB}` : 'Dettagli';
      const risultatoLink = `<a href="partita.html?id=${idPartita}">${risultato}</a>`;

      row.innerHTML = `
        <td>${p.squadraA || ''}</td>
        <td>${p.squadraB || ''}</td>
        <td>${p.data || ''}</td>
        <td>${p.orario || ''}</td>
        <td>${p.campo || ''}</td>
        <td>${risultatoLink}</td>
        <td>${p.girone || ''}</td>
      `;
      table.appendChild(row);
    });

    section.appendChild(table);
    div.appendChild(section);
  });
}

document.addEventListener('DOMContentLoaded', loadCalendar);
