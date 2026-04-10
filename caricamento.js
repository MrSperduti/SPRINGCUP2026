document.addEventListener("DOMContentLoaded", () => {
  // Gestire l'upload dei file e le anteprime
  const previewDiv = document.getElementById("preview");

  function handleFileUpload(event, type) {
    const file = event.target.files[0];

    if (type === 'pdf' && file.type === 'application/pdf') {
      const pdfPreview = document.createElement("a");
      pdfPreview.href = URL.createObjectURL(file);
      pdfPreview.target = "_blank";
      pdfPreview.textContent = `Apri ${file.name}`;
      previewDiv.appendChild(pdfPreview);
    } else if (type === 'image' && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = "100%";
      previewDiv.appendChild(img);
    } else if (type === 'video' && file.type.startsWith('video')) {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.controls = true;
      video.style.maxWidth = "100%";
      previewDiv.appendChild(video);
    }
  }

  // Collega gli input ai rispettivi file
  document.getElementById("pdfInput").addEventListener("change", (e) => handleFileUpload(e, 'pdf'));
  document.getElementById("imageInput").addEventListener("change", (e) => handleFileUpload(e, 'image'));
  document.getElementById("videoInput").addEventListener("change", (e) => handleFileUpload(e, 'video'));
});