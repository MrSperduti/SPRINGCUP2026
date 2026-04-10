
async function loadPortieri() {
  const cat = new URLSearchParams(location.search).get('categoria');
  const res = await fetch('dati.json');
  const dati = await res.json();
  const div = document.getElementById('portieri');
  const count = {};

  (dati[cat]?.partite || []).forEach(p => {
    const nome = p.portiere;
    const squadra = p.squadraPortiere || "-";
    if (!nome) return;
    const key = nome + "_" + squadra;
    if (!count[key]) count[key] = { nome, squadra, voti: 0 };
    count[key].voti += 1;
  });

  const table = document.createElement('table');
  table.innerHTML = '<tr><th>Portiere</th><th>Squadra</th><th>Voti</th></tr>';
  Object.values(count)
    .sort((a, b) => b.voti - a.voti)
    .forEach(info => {
      table.innerHTML += `<tr><td>${info.nome}</td><td>${info.squadra}</td><td>${info.voti}</td></tr>`;
    });
  div.appendChild(table);
}
document.addEventListener('DOMContentLoaded', loadPortieri);
