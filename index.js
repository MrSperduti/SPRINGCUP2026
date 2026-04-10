
document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('dati.json');
  const dati = await res.json();
  const container = document.getElementById('categorie');
  Object.keys(dati).forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = 'category-button';
    btn.onclick = () => location.href = 'categoria.html?categoria=' + encodeURIComponent(cat);
    container.appendChild(btn);
  });
});
