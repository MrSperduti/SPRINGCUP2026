document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("fotoContainer");

  try {
    const res = await fetch("/SPRINGCUP2026/fotoFiles.json?cache=" + Date.now());

    if (!res.ok) {
      throw new Error("fotoFiles.json non trovato");
    }

    const data = await res.json();
    const albums = data?.fotoAlbums || {};

    const albumNames = Object.keys(albums).sort((a, b) => a.localeCompare(b));

    if (!albumNames.length) {
      container.innerHTML = "<p class='empty-state'>Nessuna foto disponibile.</p>";
      return;
    }

    let html = "";

    albumNames.forEach((albumName) => {
      html += `
        <div class="list-card">
          <h2>${albumName}</h2>
          <div class="sponsor-list">
      `;

      (albums[albumName] || []).forEach((foto) => {
        html += `
          <img src="${foto.url}" alt="${foto.name}" class="sponsor-img">
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (error) {
    console.error("Errore nel caricamento foto:", error);
    container.innerHTML = "<p class='empty-state'>Errore nel caricamento delle foto.</p>";
  }
});
