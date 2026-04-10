
async function loadGiocatori() {
  const cat = new URLSearchParams(location.search).get('categoria');
  const res = await fetch('dati.json');
  const dati = await res.json();
  const div = document.getElementById('giocatori');
  const count = {};

  (dati[cat]?.partite || []).forEach(p => {
    const nome = p.giocatore;
    const squadra = p.squadraGiocatore || "-";
    if (!nome) return;
    const key = nome + "_" + squadra;
    if (!count[key]) count[key] = { nome, squadra, voti: 0 };
    count[key].voti += 1;
  });

  const table = document.createElement('table');
  table.innerHTML = '<tr><th>Giocatore</th><th>Squadra</th><th>Voti</th></tr>';
  Object.values(count)
    .sort((a, b) => b.voti - a.voti)
    .forEach(info => {
      table.innerHTML += `<tr><td>${info.nome}</td><td>${info.squadra}</td><td>${info.voti}</td></tr>`;
    });
  div.appendChild(table);
}
document.addEventListener('DOMContentLoaded', loadGiocatori);
