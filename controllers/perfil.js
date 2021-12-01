import cnn from "../database/connection.js"
import fileUpload from 'express-fileupload';
import { unlinkSync } from 'fs';

/**
 * Renderiza la vista de perfíl del alumno y envía como parámetros los datos del alumno
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de perfíl con los datos, en caso de error, imprime el error en consola
 */
export const profile = async (req, res) => {
    cnn.query(`
        SELECT 
            idAlumno, 
            nombres, 
            apellidos, 
            direccion, 
            telefono, 
            sexo, 
            email, 
            DNI 
        FROM alumnos WHERE idAlumno=${req.query.idAlumno};`, (err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            res.send("Debe enviar un identificador de alumno válido");
            return
        }
        res.render('perfil', { data: result })
    })
}

/**
 * Actualiza la foto de perfíl del alumno
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna una si la operación se realizó con éxito o no
 */
export const updateImg = async (req, res) => {
    let sampleFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log("No subió ningún archivo")
        return
    }
    sampleFile = req.files.profile_photo;
    sampleFile.name = req.body.DNI + '.png' || "error.png"
    uploadPath = process.cwd() + '/public/users/' + sampleFile.name;
    sampleFile.mv(uploadPath, function (err) {
        if (err)
            console.log('Ocurrió un error', err)
        console.log('Archivo subido')
        
    });

    res.redirect(`/alumnos/perfil?idAlumno=${req.body.idAlumno}`)
}