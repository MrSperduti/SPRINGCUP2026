document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("documentiContainer");

  function formatBytes(bytes) {
    if (!bytes || isNaN(bytes)) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  try {
    const res = await fetch("/SPRINGCUP2026/regolamentoFiles.json?cache=" + Date.now());

    if (!res.ok) {
      throw new Error("File regolamentoFiles.json non trovato");
    }

    const data = await res.json();
    const files = Array.isArray(data.regolamentoFiles) ? data.regolamentoFiles : [];

    if (!files.length) {
      container.innerHTML = "<p class='empty-state'>Nessun documento disponibile.</p>";
      return;
    }

    let html = "";

    files.forEach((file) => {
      html += `
        <div class="list-card">
          <h3>${file.name || "Documento"}</h3>
          <p class="muted">
            ${file.type || "Tipo non disponibile"}
            ${file.size ? `• ${formatBytes(file.size)}` : ""}
          </p>
          <a class="btn" href="${file.url}" target="_blank" rel="noopener noreferrer">📄 Apri documento</a>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (error) {
    console.error("Errore nel caricamento dei documenti:", error);
    container.innerHTML = "<p class='empty-state'>Errore nel caricamento dei documenti.</p>";
  }
});
