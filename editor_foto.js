document.addEventListener("DOMContentLoaded", function () {
  const fotoInput = document.getElementById("fotoInput");
  const albumInput = document.getElementById("albumInput");
  const uploadFileButton = document.getElementById("uploadFileButton");
  const generateJsonButton = document.getElementById("generateJsonButton");
  const previewDati = document.getElementById("previewDati");
  const albumsContainer = document.getElementById("albumsContainer");
  const jsonDownloadContainer = document.getElementById("jsonDownloadContainer");

  let downloadJsonLink = null;

  function getStoredAlbums() {
    try {
      return JSON.parse(localStorage.getItem("fotoAlbums")) || {};
    } catch (error) {
      return {};
    }
  }

  function setStoredAlbums(albums) {
    localStorage.setItem("fotoAlbums", JSON.stringify(albums));
  }

  function normalizeAlbumName(name) {
    return (name || "").trim().replace(/\s+/g, "_").toUpperCase();
  }

  function renderAlbums(albums) {
    albumsContainer.innerHTML = "";

    const albumNames = Object.keys(albums).sort((a, b) => a.localeCompare(b));

    if (!albumNames.length) {
      albumsContainer.innerHTML = "<p class='empty-state'>Nessuna foto caricata.</p>";
      return;
    }

    albumNames.forEach((albumName) => {
      const section = document.createElement("div");
      section.className = "list-card";

      const title = document.createElement("h3");
      title.textContent = albumName;
      section.appendChild(title);

      const files = albums[albumName] || [];

      files.forEach((file) => {
        const card = document.createElement("div");
        card.className = "list-card";

        const img = document.createElement("img");
        img.src = file.url;
        img.alt = file.name;
        img.style.width = "100%";
        img.style.maxWidth = "220px";
        img.style.height = "auto";
        img.style.borderRadius = "12px";
        img.style.display = "block";
        img.style.margin = "0 auto 10px";

        const name = document.createElement("p");
        name.textContent = file.name;

        const removeBtn = document.createElement("a");
        removeBtn.href = "#";
        removeBtn.className = "btn secondary";
        removeBtn.textContent = "🗑️ Rimuovi";
        removeBtn.onclick = function (e) {
          e.preventDefault();

          const updatedAlbums = getStoredAlbums();
          updatedAlbums[albumName] = (updatedAlbums[albumName] || []).filter((f) => f.name !== file.name);

          if (!updatedAlbums[albumName].length) {
            delete updatedAlbums[albumName];
          }

          setStoredAlbums(updatedAlbums);
          renderAlbums(updatedAlbums);
        };

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(removeBtn);
        section.appendChild(card);
      });

      albumsContainer.appendChild(section);
    });
  }

  uploadFileButton.addEventListener("click", function (e) {
    e.preventDefault();

    const file = fotoInput.files[0];
    const rawAlbum = albumInput.value;

    if (!file) {
      alert("Seleziona una foto da caricare");
      return;
    }

    if (!rawAlbum.trim()) {
      alert("Inserisci il nome dell'album/cartella");
      return;
    }

    const albumName = normalizeAlbumName(rawAlbum);
    const fileName = file.name;
    const fileURL = `https://raw.githubusercontent.com/MrSperduti/SPRINGCUP2026/main/foto/${encodeURIComponent(albumName)}/${encodeURIComponent(fileName)}`;

    const fileDetails = {
      name: fileName,
      url: fileURL,
      type: file.type,
      size: file.size
    };

    previewDati.textContent =
      `Album: ${albumName}\n` +
      `Nome: ${fileName}\n` +
      `Tipo: ${file.type || "non disponibile"}\n` +
      `Dimensione: ${file.size} bytes\n` +
      `URL: ${fileURL}`;

    const albums = getStoredAlbums();

    if (!albums[albumName]) {
      albums[albumName] = [];
    }

    const existingIndex = albums[albumName].findIndex((f) => f.name === fileName);
    if (existingIndex !== -1) {
      albums[albumName][existingIndex] = fileDetails;
    } else {
      albums[albumName].push(fileDetails);
    }

    setStoredAlbums(albums);
    renderAlbums(albums);
  });

  generateJsonButton.addEventListener("click", function (e) {
    e.preventDefault();

    if (downloadJsonLink) {
      downloadJsonLink.remove();
      downloadJsonLink = null;
    }

    const albums = getStoredAlbums();

    const jsonBlob = new Blob(
      [JSON.stringify({ fotoAlbums: albums }, null, 2)],
      { type: "application/json" }
    );
    const jsonURL = URL.createObjectURL(jsonBlob);

    downloadJsonLink = document.createElement("a");
    downloadJsonLink.href = jsonURL;
    downloadJsonLink.download = "fotoFiles.json";
    downloadJsonLink.className = "btn";
    downloadJsonLink.textContent = "📥 Scarica JSON Generato";

    jsonDownloadContainer.innerHTML = "";
    jsonDownloadContainer.appendChild(downloadJsonLink);
  });

  renderAlbums(getStoredAlbums());
});
