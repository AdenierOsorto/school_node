import cnn from "../database/connection.js"
import fileUpload from 'express-fileupload';
import { unlinkSync } from 'fs';


/** 
 * Renderiza la vista de aulas y envía como parámetros la lista de aulas registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de aulas con los datos, en caso de error, imprime el error en consola
 */
export const listarAula = async (req, res) => {
    cnn.query(`
        SELECT 
        idAula,
        nombreAula,
        edificioAula
        FROM aulas;`, (err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.render('aulas', { data: result })
    })

}

/**
 * Renderiza la vista de aula, asignando una acción y la data necesaria para su funcionamiento
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de aula  con los datos, en caso de error, imprime el error en consola
 */
export const aula = async (req, res) => {
    const { accion, idAula } = req.query
    let aula = ''
    if (idAula && accion == 'editar') {
        cnn.query(`
        SELECT  
            idAula,
            nombreAula,
            edificioAula

        FROM aulas WHERE idAula=${idAula};`, (err, result) => {
            res.render('aula', { accion: accion, data: result })
            return
        })
    } else if (accion) {
        res.render('aula', { accion: accion, data: aula, idAula: idAula })
        return
    } else {
        res.send("Acción no definida")
        return
    }

}

/**
 * Almacena el aula  y renderiza la pantalla principal de registro
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna la vista de aulas  con los datos actualizados
 */
export const guardarAulas = async (req, res) => {
    const {
        aulanombre,
        aulaedificio } = req.body
    res.redirect("/aulas")
    if (!aulanombre || !aulaedificio) {
        res.send("Debe enviar los datos completos")
        return
    }
    const data = {
        nombreAula: aulanombre,
        edificioAula: aulaedificio
    }
    cnn.query("INSERT INTO aulas SET ?", [data], async (err, result) => {
        if (err) {
            res.send(err)
            return
        }



        res.redirect("/aulas")

    })
}

/**
 * 
 * Elimina el registro del aula 
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna una si la operación se realizó con éxito o no
 */
export const eliminarAula = async (req, res) => {
    const { idAula } = req.body
    if (!idAula) {
        res.setHeader("Content-Type", "application/json")
        res.statusCode = 501
        res.json({ type: 'error' })
        return
    }
    cnn.query("DELETE FROM aulas WHERE idAula=?", [idAula], async (err, result) => {
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

/**
 * Edita el registro del aula 
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna una si la operación se realizó con éxito o no 
 */
export const editarAula = async (req, res) => {
    const {
        aulanombre,
        aulaedificio,
        idAula } = req.body
    if (!aulanombre || !aulaedificio) {
        res.send("Debe enviar los datos completos")
        return
    }
    const data = {
        nombreAula: aulanombre,
        edificioAula: aulaedificio
    }
    cnn.query(`UPDATE aulas SET nombreAula='${aulanombre}', edificioAula='${aulaedificio}' WHERE idAula=${idAula};`, [data], async (err, result) => {
        if (err) {
            res.send(err)
            return
        }

        res.redirect("/aulas")

    })
}