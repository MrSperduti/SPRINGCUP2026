document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const album = params.get("album");

  const albumTitle = document.getElementById("albumTitle");
  const container = document.getElementById("albumContainer");

  if (!album) {
    container.innerHTML = "<p class='empty-state'>Album non valido.</p>";
    return;
  }

  albumTitle.textContent = album;

  try {
    const res = await fetch("/SPRINGCUP2026/fotoFiles.json?cache=" + Date.now());

    if (!res.ok) {
      throw new Error("fotoFiles.json non trovato");
    }

    const data = await res.json();
    const albums = data?.fotoAlbums || {};
    const fotoList = albums[album] || [];

    if (!fotoList.length) {
      container.innerHTML = "<p class='empty-state'>Nessuna foto disponibile in questo album.</p>";
      return;
    }

    let html = `<div class="sponsor-list">`;

    fotoList.forEach((foto) => {
      html += `
        <div class="list-card">
          <img src="${foto.url}" alt="${foto.name}" class="sponsor-img">
          <p class="muted">${foto.name}</p>
        </div>
      `;
    });

    html += `</div>`;

    container.innerHTML = html;
  } catch (error) {
    console.error("Errore nel caricamento delle foto:", error);
    container.innerHTML = "<p class='empty-state'>Errore nel caricamento delle foto.</p>";
  }
});
