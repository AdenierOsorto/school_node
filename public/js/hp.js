const html = (dia) => {
    return (`
    <div class="col-8 mb-3" id="${dia}-col">
    <h4>${dia.toUpperCase()}</h4>
    <div class="row">
    <div class="col">
    <label for="${dia}hi" class="form-label">Hora Entrada</label>
    <select name="${dia}hi" id="${dia}hi" class="form-select" required>
        <option value="" selected disabled>Seleccione hora de entrada</option>
        <option value="07:00">07:00</option>
        <option value="08:00">08:00</option>
        <option value="09:00">09:00</option>
        <option value="10:00">10:00</option>
        <option value="11:00">11:00</option>
        <option value="13:00">13:00</option>
        <option value="14:00">14:00</option>
    </select>
    </div>
    <div class="col">
        <label for="${dia}hf" class="form-label">Hora Salida</label>
        <select name="${dia}hf" id="${dia}hf" class="form-select" required>
            <option value="" selected disabled>Seleccione hora de salida</option>
            <option value="08:00">08:00</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="12:00">12:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
        </select>
    </div>
    </div>
    </div>`)
}

$(':checkbox').on('change', function () {
    $(this).is(":checked") ? (
        $("#frm-container").append(html($(this).data('dia')))
    ): (
        $("#"+$(this).data('dia')+"-col").remove()
    );
});