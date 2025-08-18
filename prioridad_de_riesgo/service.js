export function renderTableColumn(data) {
  const tableBody = document.querySelector("table tbody");
  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <th scope="row">${item.prioridad}</th>
      <td>${item.rangoMin}</td>
      <td>${item.rangoMax}</td>
      <td>${item.activo ? "Si" : "No"}</td>
      <td>
        <button type="button" class="btn btn-warning">Editar</button>
        <button type="button" class="btn btn-danger">Eliminar</button>
      </td>         
    `;
    tableBody.appendChild(row);
  });
}
