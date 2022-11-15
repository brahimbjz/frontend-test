$(function() {

    // Evento al cargar la web
    function init() {
        if (window.location.hash.length == 0) {
            goRoute('home');
        } else {
            loadRoute(window.location.hash, false);
        }
    }
    init();


    // Evento cuando la URL cambia
    $(window).on('hashchange', function(e) {
        loadRoute(window.location.hash);
    });

});


// Número de navegaciones hacia atrás disponibles
var backTimes = -1;

// Posición de scroll antes de recargar
var scrollPos = 0;


// Ir a una ruta
function goRoute(route) {
    window.location.hash = '/' + route;
}


// Volver atrás
function goBack() {
    if (backTimes > 0) {
        history.back();
        backTimes--;
    }
}


// Cargar ruta
async function loadRoute(route) {

    // Sumar numero de historial
    backTimes++;

    // Comenzar carga
    route = '/views/' + route.substring(2).split('?')[0];

    // Cargar HTML
    $.get(route + '/index.html?v=' + v, function(data) {

        $('#content').html(data);

    }).done(function() {

        // Cargar JS
        $.get(route + '/index.js?v=' + v).done(function() {

            // Hacer scroll si es necesario
            if (scrollPos > 0) {
                setTimeout(() => {
                    window.scrollTo(0, scrollPos);
                    scrollPos = 0;
                }, 100);
            }

        }).fail(function() {
            showRouteError();
        });

    }).fail(function() {
        showRouteError();
    });
}


// Recargar página
function reload() {
    scrollPos = document.documentElement.scrollTop;
    loadRoute(window.location.hash);
}


// Obtener ruta
function getRoute() {
    return window.location.hash.substring(2).split('?')[0];
}


// Obtener parámetro
function getParam(paramName, defaultVal = null) {
    var params = window.location.hash.split('?');
    var value = defaultVal;

    if (params.length > 1) {
        params = params[1].split('&');

        params.forEach(param => {
            if (param.split('=')[0] == paramName) {
                value = param.split('=')[1];
            }
        });
    }

    return value;
}


// Configurar título de la página
function setRouteTitle(title) {
    document.title = 'Test Frontend · ' + title;
    $('#page-title').text(title);
}


// Mostrar errores
function showError(title, text) {
    Swal.fire({ icon: 'error', title: title, text: text });
}


// Mostrar error de carga
function showRouteError() {
    showError('Error 404', 'Esta página no existe o su conexión a internet es débil.');
    goBack();
}


// Construir enlaces con parametros
function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
}