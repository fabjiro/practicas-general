// Datos en memoria
let actividades = [
  { nombre: 'Capacitación docentes', indicador: 'Docentes capacitados', responsable: 'Equipo Pedagógico', inicio: '2025-09-01', fin: '2025-09-15' },
  { nombre: 'Mejora de infraestructura', indicador: 'Aulas construidas', responsable: 'Área de Infraestructura', inicio: '2025-10-01', fin: '2025-12-31' }
];
let idxEdit = -1;

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

function renderTabla() {
  const $tbody = $("#tbodyActividades");
  if (!actividades.length) {
    $tbody.html('<tr class="placeholder-row"><td colspan="5" class="text-center">Sin datos para mostrar</td></tr>');
    return;
  }

  const rows = actividades
    .map((a, i) => `
      <tr>
        <td>${a.nombre}</td>
        <td class="text-center">${a.indicador}</td>
        <td>${a.responsable}</td>
        <td class="text-center">${formatDate(a.inicio)} al ${formatDate(a.fin)}</td>
        <td class="text-center">
          <button class="btn btn-primary btn-sm btn-edit" data-index="${i}"><i class="bi bi-pencil-fill"></i></button>
          <button class="btn btn-danger btn-sm btn-delete" data-index="${i}"><i class="bi bi-trash-fill"></i></button>
        </td>
      </tr>`)
    .join("");
  $tbody.html(rows);
}

function expandActividades() {
  const el = document.getElementById("actividadesCollapse");
  const instance = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
  instance.show();
}

$(document).ready(function () {
  // rotate chevrons based on collapse state
  $(document).on('click', '.section-toggle', function() {
    $(this).toggleClass('collapsed');
    $(this).find('.chevron').toggleClass('rotated');
  });

  renderTabla();

  // Agregar actividad
  $("#btnAgregar").on("click", function (e) {
    e.preventDefault();

    const nombre = $("#nombreTarea").val().trim();
    const indicador = $("#indicador").val();
    const responsable = $("#responsables").val().trim();
    const inicio = $("#fechaInicio").val();
    const fin = $("#fechaFin").val();

    // Validaciones básicas
    if (!nombre || !indicador || !responsable || !inicio || !fin) {
      alert("Complete los campos obligatorios (*)");
      return;
    }
    if (new Date(inicio) > new Date(fin)) {
      alert("La fecha de inicio no puede ser mayor que la fecha fin");
      return;
    }

    actividades.push({ nombre, indicador, responsable, inicio, fin });
    renderTabla();
    expandActividades();

    // Opcional: limpiar algunos campos de texto
    $("#nombreTarea").val("");
    $("#responsables").val("");
  });

  // Editar (abrir modal)
  $(document).on("click", ".btn-edit", function () {
    idxEdit = parseInt($(this).data("index"), 10);
    const a = actividades[idxEdit];
    $("#editarNombre").val(a.nombre);
    $("#editarIndicador").val(a.indicador);
    $("#editarResponsable").val(a.responsable);
    $("#editarInicio").val(a.inicio);
    $("#editarFin").val(a.fin);
    const modal = new bootstrap.Modal(document.getElementById("modalEditarActividad"));
    modal.show();
  });

  // Guardar edición
  $("#formEditarActividad").on("submit", function (e) {
    e.preventDefault();
    if (idxEdit < 0) return;

    const nombre = $("#editarNombre").val().trim();
    const indicador = $("#editarIndicador").val();
    const responsable = $("#editarResponsable").val().trim();
    const inicio = $("#editarInicio").val();
    const fin = $("#editarFin").val();

    if (!nombre || !indicador || !responsable || !inicio || !fin) {
      alert("Complete los campos obligatorios (*)");
      return;
    }
    if (new Date(inicio) > new Date(fin)) {
      alert("La fecha de inicio no puede ser mayor que la fecha fin");
      return;
    }

    actividades[idxEdit] = { nombre, indicador, responsable, inicio, fin };
    renderTabla();
    idxEdit = -1;
    bootstrap.Modal.getInstance(document.getElementById("modalEditarActividad")).hide();
  });

  // Eliminar
  $(document).on("click", ".btn-delete", function () {
    const idx = parseInt($(this).data("index"), 10);
    if (confirm("¿Desea eliminar esta actividad?")) {
      actividades.splice(idx, 1);
      renderTabla();
    }
  });

  // Regresar
  $("#btnBack").on("click", function () {
    history.back();
  });
});
