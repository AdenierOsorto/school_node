/**
 * Función que ejecuta una petición al servidor para eliminar un profesor
 * @param {text} idProfesor Identificador del profesor
 * @param {text} DNI Número de identidad del profesor
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