document.addEventListener('DOMContentLoaded', async () => {
  const gallery = document.getElementById('gallery');
  try {
    const data = await fetch('videoFiles.json', { cache: 'no-store' }).then(r => r.json());
    const files = data.videoFiles || [];
    if (!files.length) {
      gallery.innerHTML = '<div class="empty-state panel">Nessun video disponibile.</div>';
      return;
    }
    files.forEach(file => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      const video = document.createElement('video');
      video.src = file.url;
      video.controls = true;
      video.preload = 'metadata';
      const desc = document.createElement('p');
      desc.className = 'description';
      desc.textContent = file.description || file.title || '';
      item.appendChild(video);
      item.appendChild(desc);
      gallery.appendChild(item);
    });
  } catch {
    gallery.innerHTML = '<div class="empty-state panel">Errore nel caricamento dei video.</div>';
  }
});
