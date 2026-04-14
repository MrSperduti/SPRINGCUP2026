document.addEventListener("DOMContentLoaded", async () => {
  const categoria = new URLSearchParams(window.location.search).get("categoria");
  const titolo = document.getElementById("titolo");
  const container = document.getElementById("marcatoriContainer");

  if (!categoria) {
    if (titolo) titolo.textContent = "Classifica Marcatori";
    if (container) container.innerHTML = "<p class='empty-state'>Categoria non valida.</p>";
    return;
  }

  if (titolo) {
    titolo.textContent = `${categoria} - Classifica Marcatori`;
  }

  try {
    const res = await fetch("data/dati.json?cache=" + Date.now());
    const data = await res.json();

    const categoriaData = data[categoria];

    if (!categoriaData || !Array.isArray(categoriaData.calendario)) {
      container.innerHTML = "<p class='empty-state'>Nessun dato marcatori disponibile.</p>";
      return;
    }

    const count = {};

    categoriaData.calendario.forEach((giornata) => {
      (giornata.partite || []).forEach((partita) => {
        (partita.marcatori || []).forEach((m) => {
          const nome = (m.nome || "").trim();
          const squadra = (m.squadra || "").trim();
          const gol = parseInt(m.gol, 10) || 0;

          if (!nome) return;

          const key = `${nome}__${squadra}`;

          if (!count[key]) {
            count[key] = {
              nome,
              squadra,
              gol: 0
            };
          }

          count[key].gol += gol;
        });
      });
    });

    const marcatori = Object.values(count).sort((a, b) => {
      const diffGol = b.gol - a.gol;
      if (diffGol !== 0) return diffGol;
      return a.nome.localeCompare(b.nome);
    });

    if (!marcatori.length) {
      container.innerHTML = "<p class='empty-state'>Nessun dato marcatori disponibile.</p>";
      return;
    }

    let tableHtml = `
      <div class="table-wrap marcatori-table-wrap">
        <table class="marcatori-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Giocatore</th>
              <th>Squadra</th>
              <th>Gol</th>
            </tr>
          </thead>
          <tbody>
    `;

    let cardsHtml = `<div class="marcatori-cards">`;

    marcatori.forEach((m, index) => {
      tableHtml += `
        <tr>
          <td>${index + 1}</td>
          <td>${m.nome}</td>
          <td>${m.squadra}</td>
          <td>${m.gol}</td>
        </tr>
      `;

      cardsHtml += `
        <div class="classifica-card">
          <div class="classifica-card-top">
            <div class="classifica-posizione">#${index + 1}</div>
            <div class="classifica-squadra">${m.nome}</div>
            <div class="classifica-punti">${m.gol} gol</div>
          </div>

          <div class="list-card small">${m.squadra || "Squadra non disponibile"}</div>
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
    console.error("Errore nel caricamento dei marcatori:", error);
    container.innerHTML = "<p class='empty-state'>Errore nel caricamento dei marcatori.</p>";
  }
});
