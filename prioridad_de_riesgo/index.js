import { renderTableColumn, renderFormMessageError } from "./service.js";
import { nivelDePrioridadAlreadyExists } from "./utils.js";

const data = [];
(() => {
  "use strict";
  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
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

        const modeEdit = form.getAttribute("mode") === "edit";
        const alreadyExists = nivelDePrioridadAlreadyExists(
          data,
          newItem.prioridad
        );
        if (modeEdit) {
          if (
            alreadyExists &&
            form.getAttribute("data-id") !== newItem.prioridad
          ) {
            renderFormMessageError("El nivel de prioridad ya existe.");
            return;
          }
        } else if (alreadyExists) {
          renderFormMessageError("El nivel de prioridad ya existe.");
          return;
        }
        if (modeEdit) {
          updateItem(newItem, form.getAttribute("data-id"));
        } else {
          addItem(newItem);
        }
        closeModal();
      },
      false
    );
  });
})();

const modalEl = document.getElementById("addModal");
const form = document.getElementById("riskPriorityForm");

modalEl.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;
  if (button.classList.contains("btnEdit")) {
    form.setAttribute("mode", "edit");
    const itemId = button.getAttribute("data-id");
    form.setAttribute("data-id", itemId);
    const item = data.find((item) => item.prioridad === itemId);
    if (item) {
      form.querySelector("#validationCustom01").value = item.prioridad;
      form.querySelector("#validationCustom02").value = item.rangoMin;
      form.querySelector("#validationCustom03").value = item.rangoMax;
      form.querySelector(
        `input[name="radioDefault"][value="${item.activo ? "si" : "no"}"]`
      ).checked = true;
    }
  } else {
    form.setAttribute("mode", "add");
  }
});

const closeModal = () => {
  bootstrap.Modal.getInstance(modalEl).hide();
  cleanForm();
};

const cleanForm = () => {
  form.reset();
  form.classList.remove("was-validated");
  const formMessage = document.querySelector(".form-message");
  formMessage.setAttribute("hidden", true);
};

const addItem = (item) => {
  data.push(item);
  renderTableColumn(data);
};

const updateItem = (item, prioridad) => {
  const index = data.findIndex((i) => i.prioridad === prioridad);
  if (index !== -1) {
    data[index] = item;
    renderTableColumn(data);
  }
};

modalEl.addEventListener("hidden.bs.modal", function () {
  cleanForm();
});
