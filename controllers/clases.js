import cnn from "../database/connection.js"

/**
 * Renderiza la vista de alumnos y envía como parámetros la lista de alumnos registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de alumnos con los datos, en caso de error, imprime el error en consola
 */
 export const listarClases = async (req, res) => {
    cnn.query(`
        SELECT 
            idMateria,
            nombreMateria,
            codigoMateria

        FROM materia;`, (err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.render('Clases/clases', { Clases: result })
    })

}

/**
 * Renderiza la vista de alumnos y envía como parámetros la lista de alumnos registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} hace un insert en la base de datos, en caso de error, imprime el error en consola
 */
export const guardarClase = async (req, res) => {
    const {nombre, codigo} = req.body

    cnn.query(`
        INSERT INTO materia
        (nombreMateria, codigoMateria)
        VALUES(?, ?)`,[nombre, codigo],  (err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.redirect('/clases/')
    })

}

/**
 * Renderiza la vista de alumnos y envía como parámetros la lista de alumnos registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Eliminar la clase de la base de datos, en caso de error, imprime el error en consola
 */
export const eliminarClase = async (req, res) => {

    // consultas preparadas
    cnn.query('DELETE FROM materia WHERE idMateria= ?',[req.params.id], async (err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.redirect('/clases/')
    })
}

/**
 * Renderiza la vista de alumnos y envía como parámetros la lista de alumnos registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Buscar la clase y la renderiza, en caso de error, imprime el error en consola
 */
 export const consultaClase = async (req, res) => {

    // consultas preparadas
    cnn.query(`SELECT idMateria, nombreMateria, codigoMateria
    FROM materia WHERE idMateria = ?`,[req.params.id], async (err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.render('Clases/editarClase', {materia: result})
    })
}

/**
 * Renderiza la vista de alumnos y envía como parámetros la lista de alumnos registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} actualiza la clase en la base de datos, en caso de error, imprime el error en consola
 */
export const actualizarClase = async (req, res) => {
    const { nombre, codigo} = req.body
    // consultas preparadas
    cnn.query('UPDATE materia SET nombreMateria=?, codigoMateria=? WHERE idMateria=?',[nombre,codigo,req.params.id], async (err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.redirect('/clases/')
    })
}

