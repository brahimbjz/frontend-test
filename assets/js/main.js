// App Version
const v = Math.random();


// Manejar errores de las solicitudes HTTP
function manageError(error) {
    if (undefined !== error.response && undefined !== error.response.data && undefined !== error.response.data.status) {
        Swal.fire({ icon: 'error', title: 'Upss...', html: error.response.data.status });
    } else {
        Swal.fire({ icon: 'error', title: 'Upss...', html: 'Ha ocurrido un error inesperado. Vuelve a intentarlo y si el error persiste, contacta con nosotros' });
    }
}


// Rellenar filtros
function autoFillForms() {
    var params = window.location.hash.split('?');

    if (params.length > 1) {
        params = params[1].split('&');

        params.forEach(param => {
            paramName = param.split('=')[0];
            paramValue = param.split('=')[1];

            if (paramValue.length > 0) {

                if (paramName == 'customer_id') {
                    $('.content-body #customer_id').empty().append(`<option value="${paramValue}">#${paramValue}</option>`);
                } else {
                    $('.content-body #' + paramName).val(paramValue);
                }
            }
        });
    }
}


// Abrir y cerrar cajas
$('.content-body').on('click', '.card-collapsable .card-header', function() {
    $(this).parent().find('.card-body, .card-footer').toggle('fast');
});