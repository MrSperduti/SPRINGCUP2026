
document.addEventListener("DOMContentLoaded", async () => {
  const categoria = new URLSearchParams(location.search).get("categoria");
  const response = await fetch("dati.json");
  const dati = await response.json();
  const container = document.getElementById("classifica");

  if (!dati[categoria]) {
    container.innerHTML = "<p>Dati non disponibili per questa categoria.</p>";
    return;
  }

  const partite = dati[categoria].partite || [];
  const gironiData = dati[categoria].gironi || {};

  const gironi = {};
  Object.keys(gironiData).forEach(g => {
    gironi[g] = {};
    gironiData[g].forEach(squadra => {
      gironi[g][squadra] = {
        punti: 0, vinte: 0, pareggi: 0, perse: 0, gf: 0, gs: 0
      };
    });
  });

  partite.forEach(p => {
    const { girone, squadraA, squadraB, golA, golB } = p;
    if (!girone || !gironi[girone]) return;
    if (!(squadraA in gironi[girone]) || !(squadraB in gironi[girone])) return;
    if (typeof golA !== "number" || typeof golB !== "number") return;

    gironi[girone][squadraA].gf += golA;
    gironi[girone][squadraA].gs += golB;
    gironi[girone][squadraB].gf += golB;
    gironi[girone][squadraB].gs += golA;

    if (golA > golB) {
      gironi[girone][squadraA].punti += 3;
      gironi[girone][squadraA].vinte++;
      gironi[girone][squadraB].perse++;
    } else if (golA < golB) {
      gironi[girone][squadraB].punti += 3;
      gironi[girone][squadraB].vinte++;
      gironi[girone][squadraA].perse++;
    } else {
      gironi[girone][squadraA].punti++;
      gironi[girone][squadraB].punti++;
      gironi[girone][squadraA].pareggi++;
      gironi[girone][squadraB].pareggi++;
    }
  });

  const gironiOrdinati = Object.keys(gironi).sort();
  gironiOrdinati.forEach(g => {
    const sezione = document.createElement("div");
    sezione.className = "girone-section";
    const titolo = document.createElement("h3");
    titolo.textContent = "Girone " + g;
    sezione.appendChild(titolo);

    const table = document.createElement("table");
    table.innerHTML = "<tr><th>Squadra</th><th>Punti</th><th>Vinte</th><th>Pareggi</th><th>Perse</th><th>GF</th><th>GS</th></tr>";

    const squadre = Object.entries(gironi[g]).sort((a, b) => {
  const diffPunti = b[1].punti - a[1].punti;
  if (diffPunti !== 0) return diffPunti;

  const diffRetiA = a[1].gf - a[1].gs;
  const diffRetiB = b[1].gf - b[1].gs;
  const diffDifferenzaReti = diffRetiB - diffRetiA;
  if (diffDifferenzaReti !== 0) return diffDifferenzaReti;

  return b[1].gf - a[1].gf;
});
    squadre.forEach(([squadra, stats]) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${squadra}</td>
        <td>${stats.punti}</td>
        <td>${stats.vinte}</td>
        <td>${stats.pareggi}</td>
        <td>${stats.perse}</td>
        <td>${stats.gf}</td>
        <td>${stats.gs}</td>`;
      table.appendChild(row);
    });

    sezione.appendChild(table);
    container.appendChild(sezione);
  });
});
