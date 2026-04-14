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
    const res = await fetch("/SPRINGCUP2026/videoFiles.json?cache=" + Date.now());

    if (!res.ok) {
      throw new Error("videoFiles.json non trovato");
    }

    const data = await res.json();
    const albums = data?.videoAlbums || {};
    const videoList = albums[album] || [];

    if (!videoList.length) {
      container.innerHTML = "<p class='empty-state'>Nessun video disponibile in questo album.</p>";
      return;
    }

    let html = "";

    videoList.forEach((video) => {
      html += `
        <div class="list-card">
          <h3>${video.name || "Video"}</h3>
          ${video.description ? `<p class="muted">${video.description}</p>` : ""}
          <video controls style="width:100%; max-width:760px; border-radius:14px; margin-top:10px;">
            <source src="${video.url}" type="${video.type || "video/mp4"}">
            Il tuo browser non supporta il tag video.
          </video>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (error) {
    console.error("Errore nel caricamento dell'album video:", error);
    container.innerHTML = "<p class='empty-state'>Errore nel caricamento dei video.</p>";
  }
});
