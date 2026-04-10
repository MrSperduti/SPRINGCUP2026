document.addEventListener("DOMContentLoaded", function() {
  const gallery = document.getElementById('gallery');

  fetch('https://raw.githubusercontent.com/MrSperduti/springcup2025-/main/fotoFiles.json')
    .then(response => response.json())
    .then(data => {
      data.fotoFiles.forEach(file => {
        const item = document.createElement('div');
        item.classList.add('gallery-item');

        const img = document.createElement('img');
        img.src = file.url;
        img.alt = file.name;
        img.onclick = function() {
          if (img.requestFullscreen) {
            img.requestFullscreen();
          } else if (img.webkitRequestFullscreen) {
            img.webkitRequestFullscreen();
          } else if (img.msRequestFullscreen) {
            img.msRequestFullscreen();
          }
        };

        const desc = document.createElement('p');
        desc.classList.add('description');
        desc.textContent = file.description || '';

        item.appendChild(img);
        item.appendChild(desc);
        gallery.appendChild(item);
      });
    })
    .catch(error => {
      console.error('Errore durante il caricamento delle foto:', error);
    });
});
