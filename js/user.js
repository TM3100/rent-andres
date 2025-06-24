const API_URL = "https://csrent.onrender.com/user";
const form = document.getElementById("user-form");
const tableBody = document.getElementById("user-table-body");
const searchInput = document.getElementById("search-user");

let users = [];

function fetchUsers() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      users = data;
      renderTable(users);
    })
    .catch(err => console.error("Error al obtener usuarios:", err));
}

function renderTable(data) {
  tableBody.innerHTML = "";
  data.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      
      <td>${user.role}</td>
      <td>
        <button onclick="editUser(${user.id})">Editar</button>
        <button onclick="deleteUser(${user.id})">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("user-id").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const payload = { name, email, password, role };

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
      fetchUsers();
    })
    .catch(err => console.error("Error al guardar usuario:", err));
});

function editUser(id) {
  const user = users.find(u => u.id === id);
  if (!user) {
    console.error("Usuario no encontrado con ID:", id);
    return;
  }

  document.getElementById("user-id").value = user.id;
  document.getElementById("name").value = user.name;
  document.getElementById("email").value = user.email;
  document.getElementById("password").value = user.password;
  document.getElementById("role").value = user.role;
}

function deleteUser(id) {
  if (confirm("¿Seguro que deseas eliminar este usuario?")) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => fetchUsers())
      .catch(err => console.error("Error al eliminar usuario:", err));
  }
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = users.filter(u => u.name.toLowerCase().includes(value));
  renderTable(filtered);
});

document.addEventListener("DOMContentLoaded", fetchUsers);
