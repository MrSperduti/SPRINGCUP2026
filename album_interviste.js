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
    const res = await fetch("/SPRINGCUP2026/intervisteFiles.json?cache=" + Date.now());

    if (!res.ok) {
      throw new Error("intervisteFiles.json non trovato");
    }

    const data = await res.json();
    const albums = data?.intervisteAlbums || {};
    const list = albums[album] || [];

    if (!list.length) {
      container.innerHTML = "<p class='empty-state'>Nessuna intervista disponibile in questo album.</p>";
      return;
    }

    let html = "";

    list.forEach((item) => {
      html += `
        <div class="list-card">
          <h3>${item.name || "Intervista"}</h3>
          ${item.description ? `<p class="muted">${item.description}</p>` : ""}
          <video controls style="width:100%; max-width:760px; border-radius:14px; margin-top:10px;">
            <source src="${item.url}" type="${item.type || "video/mp4"}">
            Il tuo browser non supporta il tag video.
          </video>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (error) {
    console.error("Errore nel caricamento dell'album interviste:", error);
    container.innerHTML = "<p class='empty-state'>Errore nel caricamento delle interviste.</p>";
  }
});
