document.addEventListener("DOMContentLoaded", async function () {
  const categoria = new URLSearchParams(window.location.search).get("categoria");
  const calendarioContainer = document.getElementById("calendarioContainer");

  if (!categoria) {
    calendarioContainer.innerHTML = "<p>Categoria non valida.</p>";
    return;
  }

  async function loadCalendario() {
    try {
      const response = await fetch("data/dati.json?cache=" + Date.now());
      const dati = await response.json();

      const categoriaDati = dati[categoria];

      if (!categoriaDati || !Array.isArray(categoriaDati.calendario)) {
        calendarioContainer.innerHTML = "<p>Nessun calendario disponibile per questa categoria.</p>";
        return;
      }

      calendarioContainer.innerHTML = "";

      categoriaDati.calendario.forEach((giornata, giornataIndex) => {
        const giornataDiv = document.createElement("div");
        giornataDiv.classList.add("panel");

        const giornataTitle = document.createElement("h2");
        giornataTitle.textContent = `Giornata ${giornata.giornata}`;
        giornataDiv.appendChild(giornataTitle);

        let html = `
          <table>
            <thead>
              <tr>
                <th>Squadra A</th>
                <th>Squadra B</th>
                <th>Risultato</th>
                <th>Data</th>
                <th>Ora</th>
                <th>Campo</th>
              </tr>
            </thead>
            <tbody>
        `;

        (giornata.partite || []).forEach((partita, partitaIndex) => {
          const squadre = (partita.squadre || "").split(" vs ");
          const squadraA = squadre[0] || "";
          const squadraB = squadre[1] || "";
          const risultato = partita.risultato || "Dettagli";

          html += `
            <tr>
              <td>${squadraA}</td>
              <td>${squadraB}</td>
              <td>
                <a href="partita.html?categoria=${encodeURIComponent(categoria)}&giornata=${giornataIndex}&partita=${partitaIndex}">
                  ${risultato}
                </a>
              </td>
              <td>${partita.data || ""}</td>
              <td>${partita.ora || ""}</td>
              <td>${partita.campo || ""}</td>
            </tr>
          `;
        });

        html += `
            </tbody>
          </table>
        `;

        giornataDiv.innerHTML += html;
        calendarioContainer.appendChild(giornataDiv);
      });
    } catch (error) {
      console.error("Errore nel caricamento del calendario:", error);
      calendarioContainer.innerHTML = "<p>Errore nel caricamento del calendario.</p>";
    }
  }

  loadCalendario();
});
