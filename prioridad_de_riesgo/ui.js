export function renderTable(data) {
  const tableBody = document.querySelector("table tbody");
  tableBody.innerHTML = "";
  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <th scope="row">${item.prioridad}</th>
      <td>${item.rangoMin}</td>
      <td>${item.rangoMax}</td>
      <td>${item.activo ? "Si" : "No"}</td>
      <td>
        <button type="button" class="btn btn-warning btnEdit" data-id="${
          item.prioridad
        }" data-bs-toggle="modal"
      data-bs-target="#addModal">Editar</button>
        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" data-id="${
          item.prioridad
        }">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

export function renderFormMessageError(message) {
  const element = document.querySelector(".form-message");
  element.removeAttribute("hidden");
  element.innerHTML = message || "Ocurrió un error al guardar";
}

export function clearForm() {
    const form = document.getElementById("riskPriorityForm");
    form.reset();
    form.classList.remove("was-validated");
    const formMessage = document.querySelector(".form-message");
    formMessage.setAttribute("hidden", true);
}

export function closeModal() {
    const modalEl = document.getElementById("addModal");
    bootstrap.Modal.getInstance(modalEl).hide();
    clearForm();
}

export function setFormValues(item) {
    const form = document.getElementById("riskPriorityForm");
    form.querySelector("#prioridad").value = item.prioridad;
    form.querySelector("#rangoMin").value = item.rangoMin;
    form.querySelector("#rangoMax").value = item.rangoMax;
    form.querySelector(
        `input[name="radioDefault"][value="${item.activo ? "si" : "no"}"]`
    ).checked = true;
}