import cnn from "../database/connection.js"

/**
 * Renderiza la vista de horario_profesor y envía como parámetros la lista de campos registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de horario_profesor con los datos, en caso de error, imprime el error en consola
 */
export const listarhp = async (req, res) => {
    let data = {}
    cnn.query(`
    select
        a.nombreAula,
        m.nombreMateria,
        concat(p.nombreProfesor, " ", p.apellidoProfesor) as Profesor,
        hp.idHorario,
        group_concat(dhp.dia) as 'dias',
        group_concat(dhp.hora_inicio) as 'hora_inicio',
        group_concat(dhp.hora_fin) as 'hora_fin'
    from
        horario_profesor hp
    inner join aulas a on
        a.idAula = hp.idAula
    inner join materia m on
        m.idMateria = hp.idMateria
    inner join profesores p on
        p.idProfesor = hp.idProfesor
    inner join detalle_horario_profesor dhp on
        dhp.idHorario = hp.idHorario
    group by
	    hp.idHorario`, (err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.render('horario_profesor', { data: result })
    })

}

/**
 * Renderiza la vista de alumno, asignando una acción y la data necesaria para su funcionamiento
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de alumno con los datos, en caso de error, imprime el error en consola
 */
export const hp = async (req, res) => {
    const { accion, idHorario } = req.query
    let data = {}
    cnn.query('SELECT * FROM aulas', function (err, results, fields) {
        data.aulas = results
    });
    cnn.query('SELECT * FROM materia', function (err, results, fields) {
        data.materia = results
    });
    cnn.query('SELECT * FROM profesores', function (err, results, fields) {
        data.profesores = results
        if (accion) {
            res.render('hp', { accion: accion, data: data })
        }

    });
    /* if (idHorario && accion == 'editar') {
        cnn.query(`
        SELECT 
            idHorario, 
            nombres, 
            apellidos, 
            direccion, 
            telefono, 
            sexo, 
            email, 
            DNI
        FROM alumnos WHERE idHorario=${idHorario};`, (err, result) => {
            res.render('alumno', { accion: accion, data: result })
            return
        })
    } else if (accion) {
        console.log(aulas, materia, profesores)
        res.render('hp', {accion: accion})
        return
    } else {
        res.send("Acción no definida")
        return
    } */

}

/**
 * Almacena el alumno y renderiza la pantalla principal de registro
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna la vista de alumnos con los datos actualizados
 */
export const guardarHP = async (req, res) => {
    const {
        idAula,
        idMateria,
        idProfesor,
        lunes,
        martes,
        miercoles,
        jueves,
        viernes } = req.body
    if (!idAula || !idMateria || !idProfesor) {
        res.send("Debe enviar los datos completos")
        return
    }
    const data = {
        idAula: idAula,
        idMateria: idMateria,
        idProfesor: idProfesor
    }
    cnn.query("INSERT INTO horario_profesor SET ?", [data], async (err, result) => {
        if (err) {
            res.send(err)
            return
        }
        lunes ? (
            cnn.query("INSERT INTO detalle_horario_profesor SET ?", [{ idHorario: result.insertId, dia: 'lunes', hora_inicio: req.body.luneshi, hora_fin: req.body.luneshf }], async (err, result) => { err ? console.log(err) : console.log(result) })
        ) : console.log('')
        martes ? (
            cnn.query("INSERT INTO detalle_horario_profesor SET ?", [{ idHorario: result.insertId, dia: 'martes', hora_inicio: req.body.marteshi, hora_fin: req.body.marteshf }], async (err, result) => { err ? console.log(err) : console.log(result) })
        ) : console.log('')
        miercoles ? (
            cnn.query("INSERT INTO detalle_horario_profesor SET ?", [{ idHorario: result.insertId, dia: 'miercoles', hora_inicio: req.body.miercoleshi, hora_fin: req.body.miercoleshf }], async (err, result) => { err ? console.log(err) : console.log(result) })
        ) : console.log('')
        jueves ? (
            cnn.query("INSERT INTO detalle_horario_profesor SET ?", [{ idHorario: result.insertId, dia: 'jueves', hora_inicio: req.body.jueveshi, hora_fin: req.body.jueveshf }], async (err, result) => { err ? console.log(err) : console.log(result) })
        ) : console.log('')
        viernes ? (
            cnn.query("INSERT INTO detalle_horario_profesor SET ?", [{ idHorario: result.insertId, dia: 'viernes', hora_inicio: req.body.vierneshi, hora_fin: req.body.vierneshf }], async (err, result) => { err ? console.log(err) : console.log(result) })
        ) : console.log('')
        res.redirect("/hp")
    })

}

/**
 * 
 * Elimina el registro del alumno
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna una si la operación se realizó con éxito o no
 */
export const eliminarAlumno = async (req, res) => {
    const { idAlumno, DNI } = req.body
    if (!idAlumno) {
        res.setHeader("Content-Type", "application/json")
        res.statusCode = 501
        res.json({ type: 'error' })
        return
    }
    cnn.query("DELETE FROM alumnos WHERE idAlumno=?", [idAlumno], async (err, result) => {
        if (err) {
            console.log(err)
            res.setHeader("Content-Type", "application/json")
            res.statusCode = 500
            res.json({ type: 'error' })
            return
        }
        try {
            if (DNI) {
                unlinkSync(process.cwd() + '/public/users/' + DNI + '.png');
                console.log('successfully deleted /tmp/hello')
            }
        } catch (err) {
            console.log(err)
        }
        res.setHeader("Content-Type", "application/json")
        res.statusCode = 200
        res.json({ type: 'success' })

    })
}

export const editarAlumno = async (req, res) => {
    const {
        alumnoDNI,
        alumnoNombre,
        alumnoApellidos,
        alumnoTelefono,
        alumnoDireccion,
        alumnoCorreo,
        alumnoSexo,
        idAlumno } = req.body
    if (!alumnoDNI || !alumnoNombre || !alumnoTelefono || !alumnoApellidos) {
        res.send("Debe enviar los datos completos")
        return
    }
    const data = {
        DNI: alumnoDNI,
        nombres: alumnoNombre,
        apellidos: alumnoApellidos,
        direccion: alumnoDireccion,
        telefono: alumnoTelefono,
        sexo: alumnoSexo,
        email: alumnoCorreo
    }
    cnn.query(`UPDATE alumnos SET nombres='${alumnoNombre}', apellidos='${alumnoApellidos}', direccion='${alumnoDireccion}', telefono='${alumnoTelefono}', sexo='${alumnoSexo}', email='${alumnoCorreo}', DNI='${alumnoDNI}' WHERE idAlumno=${idAlumno};`, [data], async (err, result) => {
        if (err) {
            res.send(err)
            return
        }
        let sampleFile;
        let uploadPath;
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log("No subió ningún archivo")
            res.redirect("/")
            return
        }
        sampleFile = req.files.sampleFile;
        sampleFile.name = alumnoDNI + '.png' || "error.png"
        uploadPath = process.cwd() + '/public/users/' + sampleFile.name;
        sampleFile.mv(uploadPath, function (err) {
            if (err)
                console.log('Ocurrió un error', err)
            console.log('Archivo subido')
            res.redirect("/")
        });
    })
}