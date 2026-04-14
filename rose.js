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

  try {
    const res = await fetch("data/dati.json?cache=" + Date.now());
    const data = await res.json();

    const categoriaData = data[categoria];
    const rose = categoriaData?.rose || {};

    if (!Object.keys(rose).length) {
      container.innerHTML = "<p class='empty-state'>Nessuna rosa disponibile.</p>";
      return;
    }

    let html = "";

    Object.keys(rose).sort((a, b) => a.localeCompare(b)).forEach((squadra) => {
      const giocatori = [...(rose[squadra] || [])].sort((a, b) => {
        const cognomeA = (a.cognome || "").trim();
        const cognomeB = (b.cognome || "").trim();
        return cognomeA.localeCompare(cognomeB);
      });

      html += `
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
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (error) {
    console.error("Errore nel caricamento delle rose:", error);
    container.innerHTML = "<p class='empty-state'>Errore nel caricamento delle rose.</p>";
  }
});
