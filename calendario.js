document.addEventListener("DOMContentLoaded", function () {
  const categoria = new URLSearchParams(window.location.search).get("categoria");
  const calendarioContainer = document.getElementById("calendarioContainer");

  // Verifica che la categoria sia corretta
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

        giornata.partite.forEach((partita) => {
          const partitaDiv = document.createElement("div");
          partitaDiv.classList.add("list-card");

          partitaDiv.innerHTML = `
            <p><strong>Squadre:</strong> ${partita.squadre}</p>
            <p><strong>Data:</strong> ${partita.data}</p>
            <p><strong>Ora:</strong> ${partita.ora}</p>
            <p><strong>Campo:</strong> ${partita.campo}</p>
            <p><strong>Risultato:</strong> ${partita.risultato}</p>
            <p><strong>Girone:</strong> ${partita.girone}</p>
          `;

          giornataDiv.appendChild(partitaDiv);
        });

        calendarioContainer.appendChild(giornataDiv);
      });
    } catch (error) {
      calendarioContainer.innerHTML = "<p>Errore nel caricamento del calendario.</p>";
    }
  }

  loadCalendario();
});
