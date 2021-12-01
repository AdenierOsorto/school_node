/**
 * Función que ejecuta una petición al servidor para eliminar un alumno
 * @param {text} aulaId Identificador del alumno

 */
function eliminarAula(aulaId) {
    $.ajax({
        url: '/aulas/eliminar',
        method: 'DELETE',
        async: false,
        cache: false,
        data: {
            idAula: aulaId,
        }
    })
        .done((respuesta) => {
            if (respuesta.type == 'success') {
                $("#fila-" + aulaId).fadeOut("normal", function () {
                    $("#fila-" + aulaId).remove()
                })
            }
        });
}