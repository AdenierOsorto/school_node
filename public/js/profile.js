/**
 * Evento 'click' de la foto de perfíl
 */
$("#profileImage").click(function (e) {
    $("#imageUpload").click();
});

/**
 * Función que permite mostrar y almacenar la foto previamente
 * seleccionada por el usuario
 * @param {imagen} uploader 
 * @return {} No retorna ningún valor
 */
function fasterPreview(uploader) {
    if (uploader.files && uploader.files[0]) {
        $('#profileImage').attr('src',
            window.URL.createObjectURL(uploader.files[0]));
            $( "form" ).first().submit()
    }
}

/**
 * Evento 'change' se dispara automaticamente despues
 * de seleccionar una imagen
 */
$("#imageUpload").change(function () {
    fasterPreview(this);
});