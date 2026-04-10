document.addEventListener('DOMContentLoaded', () => {
  const categoria = getCategoriaFromUrl();
  const title = document.getElementById('categoria-titolo');
  title.textContent = categoria || 'Categoria';
  const menu = document.getElementById('menu');
  [
    ['📅 Calendario', 'calendario.html'],
    ['🏆 Classifica', 'classifica.html'],
    ['👥 Gironi', 'gironi.html'],
    ['🧍 Rose', 'rose.html'],
    ['⚽ Marcatori', 'classifica-marcatori.html'],
    ['⭐ Miglior giocatore', 'classifica-giocatori.html'],
    ['🧤 Miglior portiere', 'classifica-portieri.html']
  ].forEach(([label, file]) => {
    const a = document.createElement('a');
    a.className = 'btn';
    a.href = `${file}?categoria=${encodeURIComponent(categoria || '')}`;
    a.textContent = label;
    menu.appendChild(a);
  });
});
