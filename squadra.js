document.addEventListener("DOMContentLoaded", function() {
  const squadraName = localStorage.getItem("squadraName");
  
  // Dati dei giocatori caricati da dati.json
  const giocatori = JSON.parse(localStorage.getItem("giocatoriData")) || {};

  if (!giocatori[squadraName]) {
    alert("Nessun dato trovato per la squadra selezionata.");
    return;
  }

  const squadra = giocatori[squadraName];
  document.getElementById("squadraName").textContent = squadraName;

  const table = document.createElement("table");
  table.innerHTML = "<tr><th>Cognome</th><th>Nome</th><th>Data di Nascita</th></tr>";
  
  // Aggiunge dinamicamente tutti i giocatori dalla squadra
  squadra.forEach(player => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${player.cognome}</td><td>${player.nome}</td><td>${player.nascita}</td>`;
    table.appendChild(row);
  });

  document.getElementById("giocatoriTable").appendChild(table);
});
