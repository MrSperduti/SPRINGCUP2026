function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

document.addEventListener('DOMContentLoaded', () => {
  const categoria = getParam('categoria');
  document.getElementById('categoria-titolo').textContent = categoria;
  const menu = document.getElementById('menu');

  [
    ['Calendario', 'calendario.html'],
    ['Classifica', 'classifica.html'],
    ['Gironi', 'gironi.html'],
    ['Rose', 'rose.html'],
    ['Marcatori', 'classifica-marcatori.html'],
    ['Classifica Miglior Giocatore', 'classifica-giocatori.html'],
    ['Classifica Miglior Portiere', 'classifica-portieri.html']
  ].forEach(([nome, file]) => {
    const btn = document.createElement('button');
    btn.textContent = nome;
    btn.className = 'btn';
    btn.onclick = () => location.href = file + '?categoria=' + encodeURIComponent(categoria);
    menu.appendChild(btn);
  });
});
