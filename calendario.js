document.addEventListener("DOMContentLoaded", async function () {
  const categoria = new URLSearchParams(window.location.search).get("categoria");
  const calendarioContainer = document.getElementById("calendarioContainer");

  if (!categoria) {
    calendarioContainer.innerHTML = "<p>Categoria non valida.</p>";
    return;
  }

  // Funzione per caricare i dati dal file JSON
  async function loadCalendario() {
    try {
      const response = await fetch("data/dati.json?cache=" + Date.now());
      const dati = await response.json();

      const categoriaDati = dati[categoria];

      if (!categoriaDati || !categoriaDati.calendario) {
        calendarioContainer.innerHTML = "<p>Nessun calendario disponibile per questa categoria.</p>";
        return;
      }

      calendarioContainer.innerHTML = ""; // Pulisce il contenuto

      categoriaDati.calendario.forEach((giornata) => {
        const giornataDiv = document.createElement("div");
        giornataDiv.classList.add("panel");

        const giornataTitle = document.createElement("h2");
        giornataTitle.textContent = giornata.giornata;
        giornataDiv.appendChild(giornataTitle);

        // Crea la tabella per la giornata
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

        giornata.partite.forEach((partita) => {
          html += `
            <tr>
              <td>${partita.squadre.split(" vs ")[0]}</td>
              <td>${partita.squadre.split(" vs ")[1]}</td>
              <td>
                <a href="partita.html?id=${categoria}-${giornata.partite.indexOf(partita)}">
                  ${partita.risultato}
                </a>
              </td>
              <td>${partita.data}</td>
              <td>${partita.ora}</td>
              <td>${partita.campo}</td>
            </tr>
          `;
        });

        html += `</tbody></table>`;

        giornataDiv.innerHTML += html;

        calendarioContainer.appendChild(giornataDiv);
      });
    } catch (error) {
      calendarioContainer.innerHTML = "<p>Errore nel caricamento del calendario.</p>";
    }
  }

  loadCalendario();
});
