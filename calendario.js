document.addEventListener("DOMContentLoaded", async function () {
  const categoria = new URLSearchParams(window.location.search).get("categoria");
  const calendarioContainer = document.getElementById("calendarioContainer");

  if (!categoria) {
    calendarioContainer.innerHTML = "<p>Categoria non valida.</p>";
    return;
  }

  function getTitoloGiornata(label) {
    const testo = String(label || "").trim();
    return /^\d+$/.test(testo) ? `Giornata ${testo}` : testo;
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
        giornataDiv.classList.add("panel", "giornata-card");

        const giornataTitle = document.createElement("h2");
        giornataTitle.textContent = getTitoloGiornata(giornata.giornata);
        giornataDiv.appendChild(giornataTitle);

        let tableHtml = `
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

        let cardsHtml = `<div class="mobile-cards">`;

        (giornata.partite || []).forEach((partita, partitaIndex) => {
          const squadre = (partita.squadre || "").split(" vs ");
          const squadraA = squadre[0] || "";
          const squadraB = squadre[1] || "";
          const risultato = partita.risultato || "Dettagli";
          const link = `partita.html?categoria=${encodeURIComponent(categoria)}&giornata=${giornataIndex}&partita=${partitaIndex}`;

          tableHtml += `
            <tr>
              <td>${squadraA}</td>
              <td>${squadraB}</td>
              <td><a href="${link}">${risultato}</a></td>
              <td>${partita.data || ""}</td>
              <td>${partita.ora || ""}</td>
              <td>${partita.campo || ""}</td>
            </tr>
          `;

          cardsHtml += `
            <div class="partita-card">
              <div class="squadre">${squadraA} vs ${squadraB}</div>
              <div class="risultato"><a href="${link}">${risultato}</a></div>
              <div class="meta">
                <div><strong>Data:</strong> ${partita.data || ""}</div>
                <div><strong>Ora:</strong> ${partita.ora || ""}</div>
                <div><strong>Campo:</strong> ${partita.campo || ""}</div>
              </div>
            </div>
          `;
        });

        tableHtml += `
            </tbody>
          </table>
        `;

        cardsHtml += `</div>`;

        giornataDiv.innerHTML += tableHtml + cardsHtml;
        calendarioContainer.appendChild(giornataDiv);
      });
    } catch (error) {
      console.error("Errore nel caricamento del calendario:", error);
      calendarioContainer.innerHTML = "<p>Errore nel caricamento del calendario.</p>";
    }
  }

  loadCalendario();
});
