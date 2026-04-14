document.addEventListener("DOMContentLoaded", async () => {
  const categoria = new URLSearchParams(window.location.search).get("categoria");
  const titolo = document.getElementById("titolo");
  const container = document.getElementById("giocatoriContainer");

  if (!categoria) {
    if (titolo) titolo.textContent = "Classifica Miglior Giocatore";
    if (container) container.innerHTML = "<p class='empty-state'>Categoria non valida.</p>";
    return;
  }

  if (titolo) {
    titolo.textContent = `${categoria} - Classifica Miglior Giocatore`;
  }

  try {
    const res = await fetch("data/dati.json?cache=" + Date.now());
    const data = await res.json();

    const categoriaData = data[categoria];

    if (!categoriaData || !Array.isArray(categoriaData.calendario)) {
      container.innerHTML = "<p class='empty-state'>Nessun dato giocatori disponibile.</p>";
      return;
    }

    const count = {};

    categoriaData.calendario.forEach((giornata) => {
      (giornata.partite || []).forEach((partita) => {
        const nome = (partita.giocatore || "").trim();
        const squadra = (partita.squadraGiocatore || "-").trim();

        if (!nome) return;

        const key = `${nome}__${squadra}`;

        if (!count[key]) {
          count[key] = {
            nome,
            squadra,
            voti: 0
          };
        }

        count[key].voti += 1;
      });
    });

    const giocatori = Object.values(count).sort((a, b) => {
      const diff = b.voti - a.voti;
      if (diff !== 0) return diff;
      return a.nome.localeCompare(b.nome);
    });

    if (!giocatori.length) {
      container.innerHTML = "<p class='empty-state'>Nessun dato giocatori disponibile.</p>";
      return;
    }

    let html = `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Giocatore</th>
              <th>Squadra</th>
              <th>Voti</th>
            </tr>
          </thead>
          <tbody>
    `;

    giocatori.forEach((g, index) => {
      html += `
        <tr>
          <td>${index + 1}</td>
          <td>${g.nome}</td>
          <td>${g.squadra}</td>
          <td>${g.voti}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    console.error("Errore nel caricamento della classifica giocatori:", error);
    container.innerHTML = "<p class='empty-state'>Errore nel caricamento della classifica giocatori.</p>";
  }
});
