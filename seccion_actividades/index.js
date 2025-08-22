// Datos en memoria
const actividades = [
  {
    descripcion: "Diseño de la base de datos",
    responsables: ["Ana", "Luis"],
    recursos: ["MySQL Workbench", "Servidor de desarrollo"],
    duracion: 5,
    fechaInicio: "2025-08-25",
    fechaFin: "2025-09-08",
    indicadores: ["Modelo relacional validado", "Sin errores de integridad"],
  },
  {
    descripcion: "Implementación del backend",
    responsables: ["Carlos"],
    recursos: ["Node.js", "Express", "Postman"],
    duracion: 3,
    fechaInicio: "2025-09-09",
    fechaFin: "2025-09-30",
    indicadores: ["API funcionando", "Pruebas unitarias aprobadas"],
  },
  {
    descripcion: "Desarrollo del frontend",
    responsables: ["María", "Jorge"],
    recursos: ["React", "Figma", "Vite"],
    duracion: 4,
    fechaInicio: "2025-10-01",
    fechaFin: "2025-10-29",
    indicadores: ["Interfaz funcional", "Pruebas de usabilidad completadas"],
  },
];
let idxEdit = -1;
let rowTemplate = "";

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

function renderTabla() {
  const $tbody = $("#tbodyActividades");
  if (!actividades.length) {
    $tbody.html(
      '<tr class="placeholder-row"><td colspan="5" class="text-center">Sin datos para mostrar</td></tr>'
    );
    return;
  }

  if (!rowTemplate) {
    // Si la plantilla aún no cargó, intenta cargar y luego renderiza
    return loadTemplate().then(renderTabla);
  }

  const view = {
    actividades: actividades.map((a, i) => ({
      index: i,
      duracion: a.duracion,
      descripcion: a.descripcion,
      indicadores: a.indicadores,
      responsables: a.responsables,
      recursos: a.recursos,
      fechaInicio: formatDate(a.fechaInicio),
      fechaFin: formatDate(a.fechaFin),
    })),
  };

  const rendered = Mustache.render(rowTemplate, view);
  $tbody.html(rendered);
}

function expandActividades() {
  const el = document.getElementById("actividadesCollapse");
  const instance = bootstrap.Collapse.getOrCreateInstance(el, {
    toggle: false,
  });
  instance.show();
}

function loadTemplate() {
  return $.get("./partial.mst")
    .done((tpl) => {
      rowTemplate = tpl;
    })
    .fail(() => {
      console.error("No se pudo cargar partial.mst");
    });
}

$(document).ready(function () {
  // rotate chevrons based on collapse state
  $(document).on("click", ".section-toggle", function () {
    $(this).toggleClass("collapsed");
    $(this).find(".chevron").toggleClass("rotated");
  });

  // Cargar plantilla y renderizar
  loadTemplate().then(renderTabla);

  // Agregar actividad
  $("#btnAgregar").on("click", function (e) {
    e.preventDefault();

    const descripcion = $("#descripcion").val().trim();
    const responsables = $("#responsables").val().trim();
    const recursos = $("#recursos").val().trim();
    const duracion = parseInt($("#duracion").val(), 10);
    const fechaInicio = $("#fechaInicio").val();
    const fechaFin = $("#fechaFin").val();
    const indicadores = $("#indicadores").val();

    // Validaciones básicas
    if (
      !descripcion ||
      !indicadores ||
      !responsables ||
      !fechaInicio ||
      !fechaFin ||
      !duracion ||
      !recursos
    ) {
      alert("Complete los campos obligatorios (*)");
      return;
    }
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      alert("La fecha de inicio no puede ser mayor que la fecha fin");
      return;
    }

    actividades.push({
      descripcion,
      indicadores: indicadores.split(",").map((i) => i.trim()),
      responsables: responsables.split(",").map((r) => r.trim()),
      fechaInicio,
      fechaFin,
      recursos: recursos.split(",").map((r) => r.trim()),
      duracion,
    });
    renderTabla();
    expandActividades();

    // Limpiar el formulario
    $("#actividadForm")[0].reset();
    $("#actividadModal").modal("hide");
  });

  // Editar (abrir modal)
  $(document).on("click", ".btn-edit", function () {
    idxEdit = parseInt($(this).data("index"), 10);
    const a = actividades[idxEdit];
    $("#editarDescripcion").val(a.descripcion);
    $("#editarRecursos").val(a.recursos);
    $("#editarDuracion").val(a.duracion);
    $("#editarIndicadores").val(a.indicadores);
    $("#editarResponsables").val(a.responsables);
    $("#editarFechaInicio").val(a.fechaInicio);
    $("#editarFechaFin").val(a.fechaFin);
    const modal = new bootstrap.Modal(
      document.getElementById("modalEditarActividad")
    );
    modal.show();
  });

  // Guardar edición
  $("#formEditarActividad").on("submit", function (e) {
    e.preventDefault();
    if (idxEdit < 0) return;

    const descripcion = $("#editarDescripcion").val().trim();
    const indicadores = $("#editarIndicadores").val();
    const responsables = $("#editarResponsables").val().trim();
    const fechaInicio = $("#editarFechaInicio").val();
    const fechaFin = $("#editarFechaFin").val();
    const recursos = $("#editarRecursos").val().trim();
    const duracion = parseInt($("#editarDuracion").val(), 10);

    if (
      !descripcion ||
      !indicadores ||
      !responsables ||
      !fechaInicio ||
      !fechaFin ||
      !duracion ||
      !recursos
    ) {
      alert("Complete los campos obligatorios (*)");
      return;
    }
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      alert("La fecha de inicio no puede ser mayor que la fecha fin");
      return;
    }

    actividades[idxEdit] = {
      descripcion,
      indicadores,
      responsables,
      fechaInicio,
      fechaFin,
      recursos,
      duracion,
    };
    renderTabla();
    idxEdit = -1;
    bootstrap.Modal.getInstance(
      document.getElementById("modalEditarActividad")
    ).hide();
  });

  // Eliminar
  $(document).on("click", ".btn-delete", function () {
    const idx = parseInt($(this).data("index"), 10);
    if (confirm("¿Desea eliminar esta actividad?")) {
      actividades.splice(idx, 1);
      renderTabla();
    }
  });

  $("#actividadModal").on("hidden.bs.modal", function () {
    // Limpiar el formulario al abrir el modal
    $("#actividadForm")[0].reset();
  });

  // Regresar
  $("#btnBack").on("click", function () {
    history.back();
  });
});
