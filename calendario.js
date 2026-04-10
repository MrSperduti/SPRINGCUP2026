document.addEventListener("DOMContentLoaded", async () => {

  const cat = new URLSearchParams(location.search).get('categoria');
  const container = document.getElementById("calendarioContainer");

  const res = await fetch('data/dati.json');
  const dati = await res.json();

  const partite = dati[cat]?.partite || [];

  if (!partite.length) {
    container.innerHTML = "<p>Nessuna partita disponibile</p>";
    return;
  }

  // 🔥 raggruppa per giornata (come 2025)
  const giornate = {};

  partite.forEach(p => {
    const g = p.giornata || 1;
    if (!giornate[g]) giornate[g] = [];
    giornate[g].push(p);
  });

  let html = "";

  Object.keys(giornate)
    .sort((a, b) => a - b)
    .forEach(g => {

      html += `<h3>Giornata ${g}</h3>`;

      html += `
        <table>
        <tr>
          <th>Squadra A</th>
          <th>Squadra B</th>
          <th>Data</th>
          <th>Ora</th>
          <th>Campo</th>
          <th>Risultato</th>
          <th>Girone</th>
        </tr>
      `;

      giornate[g].forEach(p => {

        const risultato = (p.golA != null && p.golB != null)
          ? `${p.golA} - ${p.golB}`
          : 'Dettagli';

        html += `
          <tr>
            <td>${p.squadraA}</td>
            <td>${p.squadraB}</td>
            <td>${p.data || ''}</td>
            <td>${p.ora || ''}</td>
            <td>${p.campo || ''}</td>
            <td>
              <a href="partita.html?categoria=${cat}&id=${p.id}">
                ${risultato}
              </a>
            </td>
            <td>${p.girone || ''}</td>
          </tr>
        `;
      });

      html += `</table>`;
    });

  container.innerHTML = html;
});
