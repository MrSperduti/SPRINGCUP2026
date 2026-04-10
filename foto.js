document.addEventListener('DOMContentLoaded', async () => {
  const gallery = document.getElementById('gallery');
  try {
    const data = await fetch('fotoFiles.json', { cache: 'no-store' }).then(r => r.json());
    const files = data.fotoFiles || [];
    if (!files.length) {
      gallery.innerHTML = '<div class="empty-state panel">Nessuna foto disponibile.</div>';
      return;
    }
    files.forEach(file => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      const img = document.createElement('img');
      img.src = file.url;
      img.alt = file.title || file.name || 'Foto';
      img.loading = 'lazy';
      img.onclick = () => window.open(file.url, '_blank', 'noopener');
      const desc = document.createElement('p');
      desc.className = 'description';
      desc.textContent = file.description || file.title || '';
      item.appendChild(img);
      item.appendChild(desc);
      gallery.appendChild(item);
    });
  } catch {
    gallery.innerHTML = '<div class="empty-state panel">Errore nel caricamento delle foto.</div>';
  }
});
