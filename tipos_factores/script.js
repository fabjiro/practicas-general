    
let nombres = [
    { nombre: 'Juan' },
    { nombre: 'Pedro' },
    { nombre: 'Roberto' }
];


function renderTabla() {
    let tbody = '';
    nombres.forEach((n, i) => {
        tbody += `<tr>
            <td class='text-center'>${n.nombre}</td>
            <td class='text-center'>
                <button class='btn btn-primary btn-sm btnEditar' data-index='${i}'><i class='bi bi-pencil-fill'></i></button>
                <button class='btn btn-danger btn-sm btnEliminar'data-index='${i}'> <i class="bi bi-trash-fill"></i> </button>
            </td>
        </tr>`;
    });
    $(".table tbody").html(tbody);
}

$(document).ready(function() {
    
    renderTabla();

    $(document).on('click', '.btnEliminar', function() {
        let idx = $(this).data('index');
        if (confirm('¿Estás seguro de eliminar este nombre?')) {
            nombres.splice(idx, 1);
            renderTabla();
        }
    });


    $('#btnAgregar').click(function() {
        $('#formAgregar')[0].reset();
        $('#modalAgregar').modal('show');
    });  

    $('#formAgregar').submit(function(e) {
        e.preventDefault();
        let nuevo = {
            nombre: $('#nombreAgregar').val()
        };

        nombres.push(nuevo);
        renderTabla();
        $('#modalAgregar').modal('hide');
    });

    $(document).on('click', '.btnEditar', function() {
        let idx = $(this).data('index');
        let n = nombres[idx];
       $('#nombreEditar').val(n.nombre);
       $('#formEditar').data('index', idx);
       $('#modalEditar').modal('show');
    });

    $('#formEditar').submit(function(e) {
        e.preventDefault();
        let idx = $(this).data('index');
        let editado = {
            nombre: $('#nombreEditar').val()
        };
       nombres[idx] = editado; 
        renderTabla();
        $('#modalEditar').modal('hide');
    });

});