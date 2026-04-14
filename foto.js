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
      container.innerHTML = "<p class='empty-state'>Nessun album disponibile.</p>";
      return;
    }

    let html = "";

    albumNames.forEach((albumName) => {
      const count = (albums[albumName] || []).length;

      html += `
        <div class="list-card">
          <h2>${albumName}</h2>
          <p class="lead">${count} foto</p>
          <a class="btn" href="album_foto.html?album=${encodeURIComponent(albumName)}">📂 Apri album</a>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (error) {
    console.error("Errore nel caricamento album foto:", error);
    container.innerHTML = "<p class='empty-state'>Errore nel caricamento degli album.</p>";
  }
});
