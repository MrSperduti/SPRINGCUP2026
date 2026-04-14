document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("intervisteContainer");

  try {
    const res = await fetch("/SPRINGCUP2026/intervisteFiles.json?cache=" + Date.now());

    if (!res.ok) {
      throw new Error("intervisteFiles.json non trovato");
    }

    const data = await res.json();
    const albums = data?.intervisteAlbums || {};

    const albumNames = Object.keys(albums).sort((a, b) => a.localeCompare(b));

    if (!albumNames.length) {
      container.innerHTML = "<p class='empty-state'>Nessun album interviste disponibile.</p>";
      return;
    }

    let html = "";

    albumNames.forEach((albumName) => {
      const count = (albums[albumName] || []).length;

      html += `
        <div class="list-card">
          <h2>${albumName}</h2>
          <p class="lead">${count} interviste</p>
          <a class="btn" href="album_interviste.html?album=${encodeURIComponent(albumName)}">📂 Apri album</a>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (error) {
    console.error("Errore nel caricamento degli album interviste:", error);
    container.innerHTML = "<p class='empty-state'>Errore nel caricamento degli album interviste.</p>";
  }
});
