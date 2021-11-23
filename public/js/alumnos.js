/**
 * Función que ejecuta una petición al servidor para eliminar un alumno
 * @param {text} alumnoId Identificador del alumno
 * @param {text} DNI Número de identidad del alumno
 */
function eliminarAlumno(alumnoId,DNI){
    $.ajax({
        url : '/alumno/eliminar',
        method : 'DELETE',
        async:false,
        cache: false,
        data : {
            idAlumno :alumnoId,
            DNI:DNI
        }
    })
    .done((respuesta) => {
    if (respuesta.type == 'success') {
        $("#fila-"+alumnoId).fadeOut("normal", function() {
            $("#fila-"+alumnoId).remove()
        })
    }
});
}