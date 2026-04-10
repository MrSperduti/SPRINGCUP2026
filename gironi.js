document.addEventListener("DOMContentLoaded", function() {

  const urlParams = new URLSearchParams(window.location.search);
  const categoriaSelezionata = (urlParams.get("categoria") || "UNDER 17").toUpperCase();

  async function loadDatiJson() {
    const response = await fetch('data/dati.json');
    const dati = await response.json();

    if (dati[categoriaSelezionata] && dati[categoriaSelezionata].gironi) {
      return dati[categoriaSelezionata].gironi;
    } else {
      return {};
    }
  }

  const gironiContainer = document.getElementById("gironiContainer");

  async function renderGironi() {
    const gironi = await loadDatiJson();

    if (!gironi || Object.keys(gironi).length === 0) {
      gironiContainer.innerHTML = "<p>Nessun girone disponibile per questa categoria.</p>";
      return;
    }

    gironiContainer.innerHTML = "";

    Object.keys(gironi).forEach(girone => {
      const tableDiv = document.createElement("div");
      const table = document.createElement("table");

      const headerRow = document.createElement("tr");
      headerRow.innerHTML = `<th>${girone}</th>`;
      table.appendChild(headerRow);

      gironi[girone].forEach(squadra => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${squadra}</td>`;
        table.appendChild(row);
      });

      tableDiv.appendChild(table);
      gironiContainer.appendChild(tableDiv);
    });
  }

  renderGironi();
});
