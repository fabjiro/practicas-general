import { renderTableColumn } from "./service.js";

const data = [];
(() => {
  "use strict";
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();
        form.classList.add("was-validated");
        if (!form.checkValidity()) {
          return;
        }
        const data = new FormData(form);
        addItem({
          prioridad: data.get("prioridad"),
          rangoMin: data.get("rangoMin"),
          rangoMax: data.get("rangoMax"),
          activo: data.get("radioDefault") === "si",
        });
        closeModal();
      },
      false
    );
  });
})();

const form = document.getElementById("riskPriorityForm");
const closeModal = () => {
  const modalEl = document.getElementById("addModal");
  bootstrap.Modal.getInstance(modalEl).hide();
  form.reset();
};

const addItem = (item) => {
  data.push(item);
  renderTableColumn(data);
};
