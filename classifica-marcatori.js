
async function loadMarcatori() {
  const cat = new URLSearchParams(location.search).get('categoria');
  const res = await fetch('dati.json');
  const dati = await res.json();
  const div = document.getElementById('marcatori');
  const count = {};

  (dati[cat]?.partite || []).forEach(p => {
    (p.marcatori || []).forEach(m => {
      const nome = m.nome || "";
      const squadra = m.squadra || "";
      const key = nome + "_" + squadra;
      if (!count[key]) count[key] = { nome, squadra, gol: 0 };
      count[key].gol += parseInt(m.gol) || 0;
    });
  });

  const table = document.createElement('table');
  table.innerHTML = '<tr><th>Giocatore</th><th>Squadra</th><th>Gol</th></tr>';
  Object.values(count)
    .sort((a, b) => b.gol - a.gol)
    .forEach(info => {
      table.innerHTML += `<tr><td>${info.nome}</td><td>${info.squadra}</td><td>${info.gol}</td></tr>`;
    });
  div.appendChild(table);
}

document.addEventListener('DOMContentLoaded', loadMarcatori);
