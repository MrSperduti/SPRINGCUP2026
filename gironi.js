document.addEventListener("DOMContentLoaded", async () => {
  const categoria = new URLSearchParams(window.location.search).get("categoria");
  const titolo = document.getElementById("titolo");
  const container = document.getElementById("gironiContainer");

  if (!categoria) {
    if (titolo) titolo.textContent = "Gironi";
    if (container) container.innerHTML = "<p class='empty-state'>Categoria non valida.</p>";
    return;
  }

  if (titolo) {
    titolo.textContent = `${categoria} - Gironi`;
  }

  try {
    const res = await fetch("data/dati.json?cache=" + Date.now());
    const data = await res.json();

    const categoriaData = data[categoria];
    const gironi = categoriaData?.gironi || {};

    if (!Object.keys(gironi).length) {
      container.innerHTML = "<p class='empty-state'>Nessun girone disponibile.</p>";
      return;
    }

    let html = "";

    Object.keys(gironi).forEach((nomeGirone) => {
      html += `
        <div class="list-card">
          <h3>${nomeGirone}</h3>
          <div class="gironi-list">
      `;

      gironi[nomeGirone].forEach((squadra) => {
        html += `<div class="list-card small">${squadra}</div>`;
      });

      html += `
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (error) {
    console.error("Errore nel caricamento dei gironi:", error);
    container.innerHTML = "<p class='empty-state'>Errore nel caricamento dei gironi.</p>";
  }
});
