import cnn from "../database/connection.js"

/**
 * Renderiza la vista de alumnos y envía como parámetros la lista de alumnos registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de alumnos con los datos, en caso de error, imprime el error en consola
 */
 export const listarClases = async (req, res) => {
    cnn.query(`
        SELECT A.idMateria,
        B.nombreMateria,
        A.dia,
        A.horaInicio,
        A.horaFin

        FROM detallehorario as A
        inner join materia as B on A.idMateria = B.idMateria
        inner join profesores as C on A.idProfesor = C.idProfesor
        where C.DNI like '0318199911447'`, (err, result) => { //req.session.user.DNI
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.render('calificaciones/ClasesProfesor', { Clases: result })
    })

}

/**
 * Renderiza la vista de alumnos y envía como parámetros la lista de alumnos registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de alumnos con los datos, en caso de error, imprime el error en consola
 */
 export const listarAlumnosClase = async (req, res) => {

    cnn.query(`
        SELECT A.idMateria ,B.nombreMateria, F.DNI ,concat(F.nombres," ",F.apellidos) as 'nombreAlumno'
        FROM detallehorario as A
        inner join materia as B on A.idMateria = B.idMateria
        inner join profesores as C on A.idProfesor = C.idProfesor
        inner join horario as D on A.idHorario = D.idHorario
        inner join inscripcion as E on D.idHorario = E.idHorario
        inner join alumnos as F on E.idAlumno = F.idAlumno

        where B.idMateria = ? and C.DNI like '0318199911447'`,[req.params.id] ,(err, result) => {     //req.session.user.DNI
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.render('calificaciones/ClasesAlumnos', { Clases: result })
    })

}



/**
 * Renderiza la vista de alumnos y envía como parámetros la lista de alumnos registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de alumnos con los datos, en caso de error, imprime el error en consola
 */
 export const calificacionAlumno = async (req, res) => {

    cnn.query(`
        select A.idMateria, D.idCalificacion, C.nombreMateria ,E.idAlumno,E.DNI ,concat(E.nombres," ",E.apellidos) as 'nombreAlumno', D.parcial1, D.parcial2, D.parcial3,D.parcial4,
        TRUNCATE((D.parcial1 +  D.parcial2 +  D.parcial3 + D.parcial4 )/4,2) as 'Promedio'
        FROM detallehorario as A
        inner join profesores as B on A.idProfesor = B.idProfesor
        inner join materia as C on A.idMateria = C.idMateria
        inner join calificacion as D on C.idMateria = D.IdMateria
        inner join alumnos as E on D.idAlumno = E.idAlumno

        where E.DNI like ? and A.idMateria = ?`,[req.params.idA,req.params.idM] ,(err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.render('calificaciones/calificacionAlumnos', { alumno: result })
    })
}


/**
 * Renderiza la vista de alumnos y envía como parámetros la lista de alumnos registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de alumnos con los datos, en caso de error, imprime el error en consola
 */
 export const editarcalificacionAlumno = async (req, res) => {

    cnn.query(`
        select A.idMateria, D.idCalificacion, C.nombreMateria ,E.idAlumno,E.DNI ,concat(E.nombres," ",E.apellidos) as 'nombreAlumno', D.parcial1, D.parcial2, D.parcial3,D.parcial4 
        FROM detallehorario as A
        inner join profesores as B on A.idProfesor = B.idProfesor
        inner join materia as C on A.idMateria = C.idMateria
        inner join calificacion as D on C.idMateria = D.IdMateria
        inner join alumnos as E on D.idAlumno = E.idAlumno

        where E.DNI like ? and A.idMateria = ?`,[req.params.idA,req.params.idM] ,(err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.render('calificaciones/editarCalificacionAlumno', { alumno: result })
    })
}

/**
 * Renderiza la vista de alumnos y envía como parámetros la lista de alumnos registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de alumnos con los datos, en caso de error, imprime el error en consola
 */
 export const guardarcalificacionAlguarumno = async (req, res) => {
    const { DNI,parcial1,parcial2,parcial3,parcial4} = req.body

    cnn.query(`
    UPDATE calificacion
    SET parcial1=?, parcial2=?, parcial3=?, parcial4=?

        where idAlumno = ?  and idMateria = ?`,[parcial1,parcial2,parcial3,parcial4,req.params.idA,req.params.idM] ,(err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.redirect(`/cal/calificacionAlumnos/${DNI}/${req.params.idM}`)
    })
}






