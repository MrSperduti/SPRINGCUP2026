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

  function openFullscreen(el) {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  }

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

    const gallery = document.createElement("div");
    gallery.className = "photo-gallery";

    fotoList.forEach((foto) => {
      const item = document.createElement("div");
      item.className = "photo-item";

      const img = document.createElement("img");
      img.src = foto.url;
      img.alt = foto.name;
      img.className = "photo-thumb";
      img.onclick = () => openFullscreen(img);

      const caption = document.createElement("p");
      caption.className = "muted";
      caption.textContent = foto.name || "";

      item.appendChild(img);
      item.appendChild(caption);
      gallery.appendChild(item);
    });

    container.innerHTML = "";
    container.appendChild(gallery);
  } catch (error) {
    console.error("Errore nel caricamento delle foto:", error);
    container.innerHTML = "<p class='empty-state'>Errore nel caricamento delle foto.</p>";
  }
});
