document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("categorie");

  const CATEGORIE = [
    'UNDER 21',
    'UNDER 19',
    'UNDER 17',
    'UNDER 15',
    'UNDER 13',
    '2015/16',
    '2017/18',
    '2019/20'
  ];

  CATEGORIE.forEach(cat => {
    const btn = document.createElement("a");
    btn.className = "btn";
    btn.href = `categoria.html?categoria=${encodeURIComponent(cat)}`;
    btn.textContent = cat;

    container.appendChild(btn);
  });
});
