document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("videoContainer");

  try {
    const res = await fetch("/SPRINGCUP2026/videoFiles.json?cache=" + Date.now());

    if (!res.ok) {
      throw new Error("videoFiles.json non trovato");
    }

    const data = await res.json();
    const albums = data?.videoAlbums || {};

    const albumNames = Object.keys(albums).sort((a, b) => a.localeCompare(b));

    if (!albumNames.length) {
      container.innerHTML = "<p class='empty-state'>Nessun album video disponibile.</p>";
      return;
    }

    let html = "";

    albumNames.forEach((albumName) => {
      const count = (albums[albumName] || []).length;

      html += `
        <div class="list-card">
          <h2>${albumName}</h2>
          <p class="lead">${count} video</p>
          <a class="btn" href="album_video.html?album=${encodeURIComponent(albumName)}">📂 Apri album</a>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (error) {
    console.error("Errore nel caricamento degli album video:", error);
    container.innerHTML = "<p class='empty-state'>Errore nel caricamento degli album video.</p>";
  }
});
