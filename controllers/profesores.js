import cnn from "../database/connection.js"
import fileUpload from 'express-fileupload';
import { unlinkSync } from 'fs';

/**
 * Renderiza la vista de alumnos y envía como parámetros la lista de alumnos registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de alumnos con los datos, en caso de error, imprime el error en consola
 */
export const profesores = async (req, res) => {
    cnn.query(`
        SELECT 
            idProfesor, 
            nombreProfesor, 
            apellidoProfesor, 
            direccion, 
            telefono, 
            sexo, 
            email, 
            DNI 
        FROM profesores;`, (err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.render('profesores', { data: result })
    })

}

/**
 * Renderiza la vista de alumno, asignando una acción y la data necesaria para su funcionamiento
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de alumno con los datos, en caso de error, imprime el error en consola
 */
export const profesor = async (req, res) => {
    const { accion, idProfesor } = req.query
    let profesor = ''
    if (idProfesor && accion == 'editar') {
        cnn.query(`
        SELECT 
            idProfesor, 
            nombreProfesor, 
            apellidoProfesor, 
            direccion, 
            telefono, 
            sexo, 
            email, 
            DNI 
        FROM profesores WHERE idProfesor=${idProfesor};`, (err, result) => {
            res.render('profesor', { accion: accion, data: result })
            return
        })
    } else if (accion) {
        res.render('profesor', { accion: accion, data: profesor, idProfesor:idProfesor })
        return
    } else {
        res.send("Acción no definida")
        return
    }

}

/**
 * Almacena el alumno y renderiza la pantalla principal de registro
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna la vista de alumnos con los datos actualizados
 */
export const guardarProfesor = async (req, res) => {
    const {
        profesorDNI,
        profesorNombre,
        profesorApellidos,
        profesorTelefono,
        profesorDireccion,
        profesorCorreo,
        profesorSexo } = req.body
    if (!profesorDNI || !profesorNombre || !profesorTelefono || !profesorApellidos) {
        res.send("Debe enviar los datos completos")
        return
    }
    const data = {
        DNI: profesorDNI,
        nombreProfesor: profesorNombre,
        apellidoProfesor: profesorApellidos,
        direccion: profesorDireccion,
        telefono: profesorTelefono,
        email: profesorCorreo,
        sexo: profesorSexo,
        password: 'brilliant-minds2021'
    }
    cnn.query("INSERT INTO profesores SET ?", [data], async (err, result) => {
        if (err) {
            res.send(err)
            return
        }
        console.log('Todo bien')
        res.redirect("/profesores")
        
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