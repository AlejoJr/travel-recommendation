let data = null;
const input = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');

fetch('travel_recommendation_api.json')
  .then(res => res.json())
  .then(json => { data = json; console.log(data); })
  .catch(err => console.error('Error cargando JSON:', err));

function show(items) {
  resultsDiv.innerHTML = '';
  if (!items.length) {
    resultsDiv.innerHTML = '<p class="none">No se encontraron resultados.</p>';
    return;
  }
  items.forEach(item => {
    resultsDiv.innerHTML += `
      <div class="card">
        <img src="${item.imageUrl}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>`;
  });
}

function search() {
  if (!data) return;
  const q = input.value.trim().toLowerCase();
  if (!q) { resultsDiv.innerHTML = ''; return; }

  let items = [];
  if (q.startsWith('beach') || q.startsWith('playa')) {
    items = data.beaches;
  } else if (q.startsWith('temple') || q.startsWith('templo')) {
    items = data.temples;
  } else if (q.startsWith('countr') || q.startsWith('pais') || q.startsWith('país')) {
    data.countries.forEach(c => items.push(...c.cities));
  } else {
    const country = data.countries.find(c => c.name.toLowerCase().includes(q));
    if (country) items = country.cities;
  }
  show(items);
}

document.getElementById('btnSearch').addEventListener('click', search);
document.getElementById('btnClear').addEventListener('click', () => {
  input.value = '';
  resultsDiv.innerHTML = '';
});
input.addEventListener('keydown', e => { if (e.key === 'Enter') search(); });