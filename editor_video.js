document.addEventListener("DOMContentLoaded", function () {
  const videoInput = document.getElementById("videoInput");
  const albumInput = document.getElementById("albumInput");
  const descriptionInput = document.getElementById("descriptionInput");
  const uploadFileButton = document.getElementById("uploadFileButton");
  const generateJsonButton = document.getElementById("generateJsonButton");
  const previewDati = document.getElementById("previewDati");
  const albumsContainer = document.getElementById("albumsContainer");
  const jsonDownloadContainer = document.getElementById("jsonDownloadContainer");

  let downloadJsonLink = null;

  function getStoredAlbums() {
    try {
      return JSON.parse(localStorage.getItem("videoAlbums")) || {};
    } catch (error) {
      return {};
    }
  }

  function setStoredAlbums(albums) {
    localStorage.setItem("videoAlbums", JSON.stringify(albums));
  }

  function normalizeAlbumName(name) {
    return (name || "").trim().replace(/\s+/g, "_").toUpperCase();
  }

  function renderAlbums(albums) {
    albumsContainer.innerHTML = "";

    const albumNames = Object.keys(albums).sort((a, b) => a.localeCompare(b));

    if (!albumNames.length) {
      albumsContainer.innerHTML = "<p class='empty-state'>Nessun video inserito.</p>";
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

        const video = document.createElement("video");
        video.src = file.url;
        video.controls = true;
        video.style.width = "100%";
        video.style.maxWidth = "260px";
        video.style.borderRadius = "12px";
        video.style.display = "block";
        video.style.margin = "0 auto 10px";

        const name = document.createElement("p");
        name.textContent = file.name;

        if (file.description) {
          const description = document.createElement("p");
          description.className = "muted";
          description.textContent = file.description;
          card.appendChild(description);
        }

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

        card.appendChild(video);
        card.appendChild(name);
        card.appendChild(removeBtn);
        section.appendChild(card);
      });

      albumsContainer.appendChild(section);
    });
  }

  uploadFileButton.addEventListener("click", function (e) {
    e.preventDefault();

    const files = videoInput.files;
    const rawAlbum = albumInput.value;
    const description = descriptionInput.value.trim();

    if (!files.length) {
      alert("Seleziona almeno un video da caricare");
      return;
    }

    if (!rawAlbum.trim()) {
      alert("Inserisci il nome dell'album/cartella");
      return;
    }

    const albumName = normalizeAlbumName(rawAlbum);
    const albums = getStoredAlbums();

    if (!albums[albumName]) {
      albums[albumName] = [];
    }

    const uploaded = [];

    Array.from(files).forEach((file) => {
      const fileName = file.name;
      const fileURL = `/SPRINGCUP2026/video/${encodeURIComponent(albumName)}/${encodeURIComponent(fileName)}`;

      const fileDetails = {
        name: fileName,
        url: fileURL,
        type: file.type,
        size: file.size,
        description: description
      };

      const existingIndex = albums[albumName].findIndex((f) => f.name === fileName);
      if (existingIndex !== -1) {
        albums[albumName][existingIndex] = fileDetails;
      } else {
        albums[albumName].push(fileDetails);
      }

      uploaded.push(fileName);
    });

    setStoredAlbums(albums);
    renderAlbums(albums);

    previewDati.textContent =
      `Album: ${albumName}\n` +
      `Video caricati: ${uploaded.length}\n` +
      uploaded.map((name) => `- ${name}`).join("\n");

    videoInput.value = "";
    descriptionInput.value = "";
  });

  generateJsonButton.addEventListener("click", function (e) {
    e.preventDefault();

    if (downloadJsonLink) {
      downloadJsonLink.remove();
      downloadJsonLink = null;
    }

    const albums = getStoredAlbums();
    const jsonBlob = new Blob(
      [JSON.stringify({ videoAlbums: albums }, null, 2)],
      { type: "application/json" }
    );
    const jsonURL = URL.createObjectURL(jsonBlob);

    downloadJsonLink = document.createElement("a");
    downloadJsonLink.href = jsonURL;
    downloadJsonLink.download = "videoFiles.json";
    downloadJsonLink.className = "btn";
    downloadJsonLink.textContent = "📥 Scarica JSON Generato";

    jsonDownloadContainer.innerHTML = "";
    jsonDownloadContainer.appendChild(downloadJsonLink);
  });

  renderAlbums(getStoredAlbums());
});
