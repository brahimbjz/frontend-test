// Establecer título de página
setRouteTitle('Usuarios');


// Auto-completar campos del formulario
autoFillForms();


// Obtener filtros
function getFilters(get = 'query') {
    var fitlerData = {
        request: 'list',
        provider: $('#provider').val(),
        password: $('#password').val(),
        // start_date: $('#start_date').val(),
        // end_date: $('#end_date').val(),
        limit: $('#limit').val(),
        page: $('#page').val()
    };

    if (get == 'query') {
        return '?' + encodeQueryData(fitlerData);
    } else {
        return fitlerData;
    }
}


// Cargar usuarios
function getUsers() {
    axios.post('https://api.lleida.net/admin/v2/' + getFilters())
        .then(function(response) {
            response = response.data;
            if (response.status != 'Success') {
                Swal.fire({ icon: 'error', title: 'Upss...', html: response.status});
            } else {
                response.user_list.users.forEach(user => {
                    $('#usersTable tbody').append(`
                        <tr>
                            <td>${user.contact_name}</td>
                            <td class="no-tablet">${user.email}</td>
                            <td class="no-mobile">${user.country}</td>
                            <td class="no-mobile">${user.state}</td>
                            <td class="no-mobile">${moment.unix(user.created).format("DD/MM/YYYY")}</td>
                        </tr>
                    `);
                });

                $('#filter-num-users').text(response.user_list.total);

                if (response.user_list.total == 0) {
                    $('.not-found').show();
                } else {
                    $('.pagination-box').show();
                }
            }
        })
        .catch(function(error) {
            console.log(error);
            Swal.fire({ icon: 'error', title: 'Upss...', html: 'Ha ocurrido un error inesperado'});
        });
}


// Filtrar usuarios
function onFilter() {
    $('.card-collapsable .card-header').trigger('click');
    $('#page').val(1);
    goRoute('users' + getFilters());
}


// Solo cargar usuarios si se ha introducido hay filtros
if (getParam('request') !== null) {

    // Validar formulario
    let fitlerData = getFilters('object');

    if (fitlerData.provider.length < 1 || fitlerData.provider.length > 64) {
        Swal.fire({ icon: 'error', title: 'Upss...', html: 'Por favor, introduce un nombre de usuario válido'});
    }

    else if (fitlerData.password.length < 1 || fitlerData.password.length > 64) {
        Swal.fire({ icon: 'error', title: 'Upss...', html: 'Por favor, introduce una contraseña válida'});
    }

    // Obtener usuarios
    else getUsers();
}