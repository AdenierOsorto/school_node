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
export const eliminarProfesor = async (req, res) => {
    console.log(req.body);
    const { idProfesor, DNI } = req.body
    if (!idProfesor) {
        res.setHeader("Content-Type", "application/json")
        res.statusCode = 501
        res.json({ type: 'error' })
        return
    }

    cnn.query("DELETE FROM profesores WHERE idProfesor = ? and DNI = ?", [idProfesor, DNI], async (err, result) => {
        if (err) {
            console.log(err)
            res.setHeader("Content-Type", "application/json")
            res.statusCode = 500
            res.json({ type: 'error' })
            return
        }
        res.setHeader("Content-Type", "application/json")
        res.statusCode = 200
        res.json({ type: 'success' })
    })
}

export const editarProfesor = async (req, res) => {
    console.log(req.body);
    const {
        profesorDNI,
        profesorNombre,
        profesorApellidos,
        profesorTelefono,
        profesorDireccion,
        profesorCorreo,
        profesorSexo,
        idProfesor } = req.body
    if (!profesorDNI || !profesorNombre || !profesorTelefono || !profesorApellidos) {
        res.send("Debe enviar los datos completos")
        return
    }
    const data = [
        profesorNombre,
        profesorApellidos,
        profesorDireccion,
        profesorTelefono,
        profesorSexo,
        profesorCorreo,
        profesorDNI,
        idProfesor
    ]
    
    cnn.query(`UPDATE profesores 
                SET nombreProfesor= ?, apellidoProfesor= ?,
                    direccion=?, telefono=?, sexo=?, 
                    email=?, DNI=? WHERE idProfesor=?;`, data, async (err, result) => {
        if (err) {
            res.send(err)
            return
        }
        
        console.log('todo bien')
        res.redirect("/profesores")
        
    })
}