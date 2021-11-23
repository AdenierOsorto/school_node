/**
 * Función que ejecuta una petición al servidor para eliminar un alumno
 * @param {text} alumnoId Identificador del alumno
 * @param {text} DNI Número de identidad del alumno
 */
 function eliminarProfesor(idProfesor,DNI){
    $.ajax({
        url : '/profesor/eliminar',
        method : 'DELETE',
        async:false,
        cache: false,
        data : {
            idProfesor :idProfesor,
            DNI:DNI
        }
    })
    .done((respuesta) => {
    if (respuesta.type == 'success') {
        $("#fila-"+idProfesor).fadeOut("normal", function() {
            $("#fila-"+idProfesor).remove()
        })
    }
});
}