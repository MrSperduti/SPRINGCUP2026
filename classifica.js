document.addEventListener("DOMContentLoaded", async () => {
  const categoria = new URLSearchParams(window.location.search).get("categoria");
  const titolo = document.getElementById("titolo");
  const container = document.getElementById("classificaContainer");

  if (!categoria) {
    if (titolo) titolo.textContent = "Classifica";
    if (container) {
      container.innerHTML = "<p class='empty-state'>Categoria non valida.</p>";
    }
    return;
  }

  if (titolo) {
    titolo.textContent = `${categoria} - Classifica`;
  }

  try {
    const res = await fetch("data/dati.json?cache=" + Date.now());
    const data = await res.json();

    const categoriaData = data[categoria];

    if (!categoriaData || !Array.isArray(categoriaData.calendario)) {
      container.innerHTML = "<p class='empty-state'>Nessuna classifica disponibile.</p>";
      return;
    }

    const stats = {};

    function ensureTeam(nome) {
      if (!nome) return;

      if (!stats[nome]) {
        stats[nome] = {
          squadra: nome,
          punti: 0,
          giocate: 0,
          vinte: 0,
          pareggi: 0,
          perse: 0,
          gf: 0,
          gs: 0
        };
      }
    }

    categoriaData.calendario.forEach((giornata) => {
      (giornata.partite || []).forEach((partita) => {
        const squadre = (partita.squadre || "").split(" vs ");
        const squadraA = (squadre[0] || "").trim();
        const squadraB = (squadre[1] || "").trim();

        ensureTeam(squadraA);
        ensureTeam(squadraB);

        const risultato = (partita.risultato || "").trim();

        if (!risultato || risultato.toLowerCase() === "dettagli") {
          return;
        }

        const match = risultato.match(/^(\d+)\s*-\s*(\d+)$/);
        if (!match) {
          return;
        }

        const golA = parseInt(match[1], 10);
        const golB = parseInt(match[2], 10);

        if (isNaN(golA) || isNaN(golB)) {
          return;
        }

        stats[squadraA].giocate++;
        stats[squadraB].giocate++;

        stats[squadraA].gf += golA;
        stats[squadraA].gs += golB;

        stats[squadraB].gf += golB;
        stats[squadraB].gs += golA;

        if (golA > golB) {
          stats[squadraA].punti += 3;
          stats[squadraA].vinte++;
          stats[squadraB].perse++;
        } else if (golA < golB) {
          stats[squadraB].punti += 3;
          stats[squadraB].vinte++;
          stats[squadraA].perse++;
        } else {
          stats[squadraA].punti += 1;
          stats[squadraB].punti += 1;
          stats[squadraA].pareggi++;
          stats[squadraB].pareggi++;
        }
      });
    });

    const classifica = Object.values(stats).sort((a, b) => {
      const diffPunti = b.punti - a.punti;
      if (diffPunti !== 0) return diffPunti;

      const diffRetiA = a.gf - a.gs;
      const diffRetiB = b.gf - b.gs;
      const diffDifferenzaReti = diffRetiB - diffRetiA;
      if (diffDifferenzaReti !== 0) return diffDifferenzaReti;

      const diffGf = b.gf - a.gf;
      if (diffGf !== 0) return diffGf;

      return a.squadra.localeCompare(b.squadra);
    });

    if (!classifica.length) {
      container.innerHTML = "<p class='empty-state'>Nessuna classifica disponibile.</p>";
      return;
    }

    let tableHtml = `
      <div class="table-wrap classifica-table-wrap">
        <table class="classifica-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Squadra</th>
              <th>Pt</th>
              <th>G</th>
              <th>V</th>
              <th>N</th>
              <th>P</th>
              <th>GF</th>
              <th>GS</th>
              <th>DR</th>
            </tr>
          </thead>
          <tbody>
    `;

    let cardsHtml = `<div class="classifica-cards">`;

    classifica.forEach((s, index) => {
      const dr = s.gf - s.gs;

      tableHtml += `
        <tr>
          <td>${index + 1}</td>
          <td>${s.squadra}</td>
          <td>${s.punti}</td>
          <td>${s.giocate}</td>
          <td>${s.vinte}</td>
          <td>${s.pareggi}</td>
          <td>${s.perse}</td>
          <td>${s.gf}</td>
          <td>${s.gs}</td>
          <td>${dr}</td>
        </tr>
      `;

      cardsHtml += `
        <div class="classifica-card">
          <div class="classifica-card-top">
            <div class="classifica-posizione">#${index + 1}</div>
            <div class="classifica-squadra">${s.squadra}</div>
            <div class="classifica-punti">${s.punti} pt</div>
          </div>

          <div class="classifica-stats-grid">
            <div><span>G</span><strong>${s.giocate}</strong></div>
            <div><span>V</span><strong>${s.vinte}</strong></div>
            <div><span>N</span><strong>${s.pareggi}</strong></div>
            <div><span>P</span><strong>${s.perse}</strong></div>
            <div><span>GF</span><strong>${s.gf}</strong></div>
            <div><span>GS</span><strong>${s.gs}</strong></div>
            <div><span>DR</span><strong>${dr}</strong></div>
          </div>
        </div>
      `;
    });

    tableHtml += `
          </tbody>
        </table>
      </div>
    `;

    cardsHtml += `</div>`;

    container.innerHTML = tableHtml + cardsHtml;
  } catch (error) {
    console.error("Errore nel caricamento della classifica:", error);
    container.innerHTML = "<p class='empty-state'>Errore nel caricamento della classifica.</p>";
  }
});
