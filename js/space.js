const API_URL = "https://csrent.onrender.com/space";
const form = document.getElementById("space-form");
const tableBody = document.getElementById("space-table-body");
const searchInput = document.getElementById("search-space");

let spaces = [];

function fetchSpaces() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      spaces = data;
      renderTable(spaces);
    })
    .catch(err => console.error("Error al obtener espacios:", err));
}

function renderTable(data) {
  tableBody.innerHTML = "";
  data.forEach(space => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${space.name}</td>
      <td>${space.areaInSquareMeters}</td>
      <td>${space.capacity}</td>
      <td>
        <button onclick="editSpace(${space.id})">Editar</button>
        <button onclick="deleteSpace(${space.id})">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("space-id").value;
  const name = document.getElementById("name").value;
  const areaInSquareMeters = parseFloat(document.getElementById("areaInSquareMeters").value);
  const capacity = parseInt(document.getElementById("capacity").value);

  const payload = { name, areaInSquareMeters, capacity };

  let method = "POST";
  let url = API_URL;

  if (id) {
    payload.id = parseInt(id);
    method = "PUT";
    url = `${API_URL}/${id}`;
  }

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(() => {
      form.reset();
      fetchSpaces();
    })
    .catch(err => console.error("Error al guardar espacio:", err));
});

function editSpace(id) {
  const space = spaces.find(s => s.id === id);
  if (!space) {
    console.error("Espacio no encontrado con ID:", id);
    return;
  }

  document.getElementById("space-id").value = space.id;
  document.getElementById("name").value = space.name;
  document.getElementById("areaInSquareMeters").value = space.areaInSquareMeters;
  document.getElementById("capacity").value = space.capacity;
}

function deleteSpace(id) {
  if (confirm("¿Seguro que deseas eliminar este espacio?")) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => fetchSpaces())
      .catch(err => console.error("Error al eliminar espacio:", err));
  }
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = spaces.filter(s => s.name.toLowerCase().includes(value));
  renderTable(filtered);
});

fetchSpaces();
