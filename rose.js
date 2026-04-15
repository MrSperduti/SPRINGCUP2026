document.addEventListener("DOMContentLoaded", async () => {
  const categoria = new URLSearchParams(window.location.search).get("categoria");
  const titolo = document.getElementById("titolo");
  const container = document.getElementById("roseContainer");

  if (!categoria) {
    if (titolo) titolo.textContent = "Rose";
    if (container) container.innerHTML = "<p class='empty-state'>Categoria non valida.</p>";
    return;
  }

  if (titolo) {
    titolo.textContent = `${categoria} - Rose`;
  }

  let rose = {};

  try {
    const res = await fetch("data/dati.json?cache=" + Date.now());
    const data = await res.json();

    const categoriaData = data[categoria];
    rose = categoriaData?.rose || {};

    if (!Object.keys(rose).length) {
      container.innerHTML = "<p class='empty-state'>Nessuna rosa disponibile.</p>";
      return;
    }

    mostraSquadre();
  } catch (error) {
    console.error("Errore nel caricamento delle rose:", error);
    container.innerHTML = "<p class='empty-state'>Errore nel caricamento delle rose.</p>";
  }

  function mostraSquadre() {
    const squadre = Object.keys(rose).sort((a, b) => a.localeCompare(b));

    let html = `<div class="teams-list">`;

    squadre.forEach((squadra) => {
      html += `
        <button class="btn team-btn" data-squadra="${squadra}">
          ${squadra}
        </button>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll(".team-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const squadra = btn.getAttribute("data-squadra");
        mostraGiocatori(squadra);
      });
    });
  }

  function mostraGiocatori(squadra) {
    const giocatori = [...(rose[squadra] || [])].sort((a, b) => {
      const cognomeA = (a.cognome || "").trim();
      const cognomeB = (b.cognome || "").trim();
      return cognomeA.localeCompare(cognomeB);
    });

    let html = `
      <div class="list-card">
        <h3>${squadra}</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Cognome</th>
                <th>Nome</th>
                <th>Data di nascita</th>
              </tr>
            </thead>
            <tbody>
    `;

    giocatori.forEach((g) => {
      html += `
        <tr>
          <td>${g.cognome || ""}</td>
          <td>${g.nome || ""}</td>
          <td>${g.nascita || ""}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </div>

        <div style="margin-top:16px; display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn secondary" id="btnIndietroRose">⬅️ Torna alle squadre</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    document.getElementById("btnIndietroRose").addEventListener("click", mostraSquadre);
  }
});
