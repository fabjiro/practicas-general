import {
  renderTable,
  renderFormMessageError,
  clearForm,
  closeModal,
  setFormValues,
} from "./ui.js";
import { isPriorityLevelTaken } from "./utils.js";

const data = [];
const form = document.getElementById("riskPriorityForm");
const addModalEl = document.getElementById("addModal");
const deleteModalEl = document.getElementById("deleteModal");

const handleFormSubmit = (event) => {
  event.preventDefault();
  form.classList.add("was-validated");
  if (!form.checkValidity()) {
    return;
  }

  const formData = new FormData(form);
  const newItem = {
    prioridad: formData.get("prioridad"),
    rangoMin: formData.get("rangoMin"),
    rangoMax: formData.get("rangoMax"),
    activo: formData.get("radioDefault") === "si",
  };

  const isEditMode = form.getAttribute("mode") === "edit";
  const priorityLevelExists = isPriorityLevelTaken(data, newItem.prioridad);

  if (isEditMode) {
    if (
      priorityLevelExists &&
      form.getAttribute("data-id") !== newItem.prioridad
    ) {
      renderFormMessageError("El nivel de prioridad ya existe.");
      return;
    }
    updateItem(newItem, form.getAttribute("data-id"));
  } else {
    if (priorityLevelExists) {
      renderFormMessageError("El nivel de prioridad ya existe.");
      return;
    }
    addItem(newItem);
  }

  closeModal();
};

const addItem = (item) => {
  data.push(item);
  renderTable(data);
};

const updateItem = (item, prioridad) => {
  const index = data.findIndex((i) => i.prioridad === prioridad);
  if (index !== -1) {
    data[index] = item;
    renderTable(data);
  }
};

const handleDelete = () => {
  const itemId = deleteModalEl.querySelector(".btn-danger").getAttribute("data-id");
  const index = data.findIndex((item) => item.prioridad === itemId);
  if (index !== -1) {
    data.splice(index, 1);
    renderTable(data);
  }
  bootstrap.Modal.getInstance(deleteModalEl).hide();
};

const handleAddModalShow = (event) => {
  const button = event.relatedTarget;
  if (button.classList.contains("btnEdit")) {
    form.setAttribute("mode", "edit");
    const itemId = button.getAttribute("data-id");
    form.setAttribute("data-id", itemId);
    const item = data.find((item) => item.prioridad === itemId);
    if (item) {
      setFormValues(item);
    }
  } else {
    form.setAttribute("mode", "add");
  }
};

const handleDeleteModalShow = (event) => {
    const button = event.relatedTarget;
    const itemId = button.getAttribute("data-id");
    deleteModalEl.querySelector(".btn-danger").setAttribute("data-id", itemId);
};

const initialize = () => {
  form.addEventListener("submit", handleFormSubmit);
  addModalEl.addEventListener("show.bs.modal", handleAddModalShow);
  addModalEl.addEventListener("hidden.bs.modal", clearForm);
  deleteModalEl.addEventListener("show.bs.modal", handleDeleteModalShow);
  deleteModalEl.querySelector(".btn-danger").addEventListener("click", handleDelete);
};

initialize();