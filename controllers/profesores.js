import cnn from "../database/connection.js"

/**
 * Renderiza la vista de profesores y envía como parámetros la lista de profesores registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de profesores con los datos, en caso de error, imprime el error en consola
 */
export const profesores = async (req, res) => {
    // query es una funcion para poder realizar consultas a la base de datos,primero necesita la consultas
    // luego, como opcional, pasarle parametros en un arreglo u objeto, por final un callback
    cnn.query(`SELECT idProfesor, 
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
        // si todo es correcto, se realiza un render para mostrar la informacion en profesores.ejs, 
        // no es necesario poner la extencion
        res.render('profesores', { data: result })
    })

}

/**
 * Renderiza la vista de profesores, asignando una acción y la data necesaria para su funcionamiento
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de profesores con los datos, en caso de error, imprime el error en consola
 */
export const profesor = async (req, res) => {
    // se almacena la informacion en sus respectivas variables
    const { accion, idProfesor } = req.query
    let profesor = ''
    // primero se evalua la condicion para saber que tipo de accion se esta realizando
    // si se esta editando, se buscara un usuario existente en la base de datos, para luego ser editada
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
        // si la anterior condicion no cumple se envia informacion necesaria para el formulario
        res.render('profesor', { accion: accion, data: profesor, idProfesor:idProfesor })
        return
    } else {
        res.send("Acción no definida")
        return
    }

}

/**
 * Almacena el profesores y renderiza la pantalla principal de registro
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna la vista de profesores con los datos actualizados
 */
export const guardarProfesor = async (req, res) => {
    // obtenemos la informacion enviada por el metodo post, se asigna a su respectiva valiable
    const {
        profesorDNI, profesorNombre,
        profesorApellidos, profesorTelefono,
        profesorDireccion, profesorCorreo,
        profesorSexo } = req.body
    // se valida si la informacion esta completa
    if (!profesorDNI || !profesorNombre || !profesorTelefono || !profesorApellidos) {
        res.send("Debe enviar los datos completos")
        return
    }
    // se estructuran los datos, para despues ser insertados en la base de datos
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
    // se realiza el insert en su respectiva tabla
    cnn.query("INSERT INTO profesores SET ?", [data], async (err, result) => {
        if (err) {
            res.send(err)
            return
        }
        res.redirect("/profesores")
        
    })
}

/**
 * 
 * Elimina el registro del profesor
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna una si la operación se realizó con éxito o no
 */
export const eliminarProfesor = async (req, res) => {
    // almacenamos la informacion necesaria en sus respectivas variables, 
    // que fueron enviadas en su metodo post
    const { idProfesor, DNI } = req.body
    // se valida si el el id existe
    if (!idProfesor) {
        res.setHeader("Content-Type", "application/json")
        res.statusCode = 501
        res.json({ type: 'error' })
        return
    }
    // se realiza la consulta eliminar
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
/**
 * 
 * Editar el registro del profesor
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} retorna una si la operación se realizó con éxito o no
 */
export const editarProfesor = async (req, res) => {
    // se almacena la informacion necesaria en sus respetivas variables
    // que se encuentra en el body del res.
    const {
        profesorDNI,
        profesorNombre,
        profesorApellidos,
        profesorTelefono,
        profesorDireccion,
        profesorCorreo,
        profesorSexo,
        idProfesor } = req.body
    
    // se valida si la informacion esta completa
    if (!profesorDNI || !profesorNombre || !profesorTelefono || !profesorApellidos) {
        res.send("Debe enviar los datos completos")
        return
    }
    // se estructura para poder estructurar los parametros a modificar
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
    // se realiza la consulta update que actualiza los datos de su determianda relacion
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