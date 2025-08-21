// Datos en memoria
let seccionControl = [
  {descripcion: 'Falla en el sistema', importancia: 10, probabilidad: 3, impacto: 3, riesgo: '#ff0000', riesgoValor: 90, priorizacion: 60, activo: 'SI'},
  {descripcion: 'Error en la base de datos', importancia: 5, probabilidad: 2, impacto: 2, riesgo: '#ff8000', riesgoValor: 20, priorizacion: 20, activo: 'SI'},
  {descripcion: 'Caída del servidor', importancia: 1, probabilidad: 3, impacto: 1, riesgo: '#ffff00', riesgoValor: 3, priorizacion: 30, activo: 'NO'}
];

let rowTemplate = '';
let modo = 'false';
let idxEdit = -1;

function loadTemplate() {
  return $.get('./partial.mst')
    .done(tpl => { rowTemplate = tpl; })
    .fail(() => { console.error('No se pudo cargar partial.mst'); });
}

function renderTabla() {
  const $tbody = $("#tbodySeccionControl");
  if (!seccionControl.length) {
    $tbody.html('<tr class="placeholder-row"><td colspan="6" class="text-center">Sin datos para mostrar</td></tr>');
    return;
  }

  if (!rowTemplate) {
    // Si la plantilla aún no cargó, intenta cargar y luego renderiza
    return loadTemplate().then(renderTabla);
  }

  const view = {
    seccionControl: seccionControl.map((s, i) => ({
        index: i,
        descripcion: s.descripcion,
        importancia: s.importancia,
        probabilidad: s.probabilidad,
        impacto: s.impacto,
        riesgo: s.riesgo,
        riesgoValor: s.riesgoValor,
        priorizacion: s.priorizacion,
        activo: s.activo,
        esActivo: s.activo.toLowerCase() === 'si'
    }))
  };
  const rendered = Mustache.render(rowTemplate, view);
  $tbody.html(rendered);
}

function calcularCampos() {
    const importancia = parseInt($('#importancia').val()) || 0;
    const probabilidad = parseInt($('#probabilidad').val()) || 0;
    const impacto = parseInt($('#impacto').val()) || 0;
    const riesgoValor = importancia * probabilidad * impacto;
    
    $('#riesgoValor').val(riesgoValor);

    // Color de riesgo
    let color = '#ff0000';
    if (riesgoValor < 5) color = '#00ff00';
    else if (riesgoValor < 15) color = '#ffff00';
    
    $('#riesgo').val(color);

    // Priorización 
    $('#priorizacion').val(Math.floor(Math.random() * 100) + 1);
}

$(document).ready(function() {
    
    // Cargar plantilla y renderizar
    loadTemplate().then(renderTabla);
    

    $(document).on('click', '.btnActivar', function() {
    let idx = $(this).data('index');
    seccionControl[idx].activo = 'SI';
    renderTabla();
    });

    $(document).on('click', '.btnDesactivar', function() {
        let idx = $(this).data('index');
        seccionControl[idx].activo = 'NO';
        renderTabla();
    });
    
    $(document).on('click', '.btnEliminar', function() {
        let idx = $(this).data('index');
        if (confirm('¿Estás seguro de eliminar este riesgo?')) {
            seccionControl.splice(idx, 1);
            renderTabla();
        }
    });

    $('#btnAgregar').click(function() {
        modo = 'agregar';
        idxEdit = -1;
        $('#modalFormLabel').text('Agregar Sección');
        $('#btnEnviar').text('Guardar');
        $('#formSeccionControl')[0].reset();

        $('#formSeccionControl').removeData('index');
        calcularCampos();
        $('#modalForm').modal('show');
    });

    $(document).on('click', '.btnEditar', function() {
        modo = 'editar';
        idxEdit = $(this).data('index');
        let s = seccionControl[idxEdit];
        $('#modalFormLabel').text('Editar Sección');
        $('#btnEnviar').text('Actualizar');

        $('#descripcion').val(s.descripcion);
        $('#importancia').val(s.importancia);
        $('#probabilidad').val(s.probabilidad);
        $('#impacto').val(s.impacto);
        $('#riesgo').val(s.riesgo);
        $('#riesgoValor').val(s.riesgoValor);
        $('#priorizacion').val(s.priorizacion);
        $('#activo').val(s.activo);
        $('#formSeccionControl').data('index', idxEdit);
        $('#modalForm').modal('show');
    });

    $('#formSeccionControl').submit(function(e) {
        e.preventDefault();
        let nuevo = {
            descripcion: $('#descripcion').val(),
            importancia: $('#importancia').val(),
            probabilidad: $('#probabilidad').val(),
            impacto: $('#impacto').val(),
            riesgo: $('#riesgo').val(),
            riesgoValor: $('#riesgoValor').val(),
            priorizacion: $('#priorizacion').val(),
            activo: $('#activo').val()
        };

        if (modo === 'agregar') {
            seccionControl.push(nuevo);
        } else if (modo === 'editar' && idxEdit > -1) {
            seccionControl[idxEdit] = nuevo;
        }
        renderTabla();
        $('#modalForm').modal('hide');
    });

    // Al cambiar los selects
    $('#importancia, #probabilidad, #impacto').on('change', calcularCampos);

   
});