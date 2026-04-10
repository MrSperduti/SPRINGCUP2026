document.addEventListener("DOMContentLoaded", function() {
  // Recupera la categoria dalla query string dell'URL (se presente)
  const urlParams = new URLSearchParams(window.location.search);
  const categoriaSelezionata = urlParams.get("categoria") || "Under 17"; // Default a Under 17 se non presente
  
  // Funzione per caricare dinamicamente i dati dal file `dati.json`
  async function loadDatiJson() {
    const response = await fetch('dati.json');
    const dati = await response.json();

    // Verifica se ci sono dati per la categoria selezionata
    if (dati[categoriaSelezionata] && dati[categoriaSelezionata].rose) {
      return dati[categoriaSelezionata].rose;
    } else {
      return {};
    }
  }

  const squadreButtonsDiv = document.getElementById("squadreButtons");
  
  // Funzione per creare i pulsanti delle squadre in base alla categoria selezionata
  async function mostraSquadre() {
    const squadre = await loadDatiJson();

    if (!squadre || Object.keys(squadre).length === 0) {
      squadreButtonsDiv.innerHTML = "<p>Nessuna squadra disponibile per questa categoria.</p>";
      return;
    }

    squadreButtonsDiv.innerHTML = ""; // Pulisce il contenitore dei pulsanti

    Object.keys(squadre).forEach(squadra => {
      const button = Object.assign(document.createElement("button"), { className: 'button' });
      button.textContent = squadra;
      button.onclick = function() {
        // Mostra i giocatori della squadra selezionata
        mostraGiocatori(squadra);
      };
      squadreButtonsDiv.appendChild(button);
    });
  }

  // Funzione per mostrare i giocatori della squadra selezionata
  function mostraGiocatori(squadra) {
    loadDatiJson().then(giocatori => {
      const squadraGiocatori = giocatori[squadra] || [];
      // Ordinamento dei giocatori per cognome in ordine alfabetico
      squadraGiocatori.sort((a, b) => a.cognome.localeCompare(b.cognome));

      // Contenitore per i giocatori
      const giocatoriContainer = document.getElementById("giocatoriContainer");
      giocatoriContainer.innerHTML = "";

      const table = document.createElement("table");
      table.innerHTML = "<tr><th>Cognome</th><th>Nome</th><th>Data di Nascita</th></tr>";

      squadraGiocatori.forEach(player => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${player.cognome}</td><td>${player.nome}</td><td>${player.nascita}</td>`;
        table.appendChild(row);
      });

      // Aggiungi la tabella al contenitore
      giocatoriContainer.appendChild(table);

      // Aggiungi il pulsante per chiudere l'elenco
      const closeButton = Object.assign(document.createElement("button"), { className: 'button' });
      closeButton.textContent = "❌ Chiudi";
      closeButton.onclick = function() {
        giocatoriContainer.innerHTML = ""; // Rimuove la tabella
      };
      giocatoriContainer.appendChild(closeButton);
    });
  }

  // Inizializzazione
  mostraSquadre();
});
