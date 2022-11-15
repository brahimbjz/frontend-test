// Establecer título de página
setRouteTitle('Envío de SMS');


// Cargar códigos de ciudades
axios.get('/phone-codes.json')
    .then(function(response) {

        $('#code').empty();

        response.data.forEach(item => {
            $('#code').append(`
                <option value="${item.calling_code}">(+${item.calling_code}) ${item.country}</option>
            `);
        });
    });


// Obtener formulario
function getForm(get = 'query') {
    var formData = {
        request: 'sms',
        user: $('#user').val(),
        password: $('#password').val(),
        num: '%2B' + $('#code').val() + $('#phone').val(),
        txt: $('#txt').val()
    };

    if (get == 'query') {
        return '?' + encodeQueryData(formData);
    } else {
        return formData;
    }
}


// Enviar SMS
function onSend() {

    // Validar datos
    let formData = getForm('object');

    if (formData.user.length < 1 || formData.user.length > 64) {
        Swal.fire({ icon: 'error', title: 'Upss...', html: 'Por favor, introduce un nombre de usuario válido'});
    }

    else if (formData.password.length < 1 || formData.password.length > 64) {
        Swal.fire({ icon: 'error', title: 'Upss...', html: 'Por favor, introduce una contraseña válida'});
    }

    else if (formData.num.length < 9 || formData.num.length > 16) {
        Swal.fire({ icon: 'error', title: 'Upss...', html: 'Por favor, introduce un número de teléfono válido'});
    }

    else if (formData.txt.length < 1 || formData.txt.length > 256) {
        Swal.fire({ icon: 'error', title: 'Upss...', html: 'Por favor, introduce un mensaje de entre 1 y 256 caracteres'});
    }

    else axios.post(`https://api.lleida.net/sms/v2/?request=sms&user=${formData.user}&password=${formData.password}&num=${formData.num}&txt=${formData.txt}`)
        .then(function(response) {
            response = response.data;
            if (response.status != 'Success') {
                Swal.fire({ icon: 'error', title: 'Upss...', html: response.status});
            } else {
                reload();
                Swal.fire({ icon: 'success', title: '¡Estupendo!', html: 'Tu mensaje ha sido enviado con éxito'});
            }
        })
        .catch(function(error) {
            console.log(error);
            Swal.fire({ icon: 'error', title: 'Upss...', html: 'Ha ocurrido un error inesperado'});
        });
}