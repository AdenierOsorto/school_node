import cnn from "../database/connection.js"


/**
 * Renderiza la vista de alumnos y envía como parámetros la lista de alumnos registrados
 * @param {*} req datos de la petición
 * @param {*} res datos de la respuesta
 * @returns {*} Retorna la vista de alumnos con los datos, en caso de error, imprime el error en consola
 */

export const HorariosAlumno = async (req, res) => {
    
    const {idA} = req.params
    cnn.query(`
    select m.nombreMateria, au.nombreAula, d.dia, d.horaInicio, 
    d.horaFin, concat(p.nombreProfesor, " ",p.apellidoProfesor) as nombreProfesor 
    from inscripcion i
        inner join alumnos a on i.idAlumno = a.idAlumno 
        inner join horario h on i.idHorario = h.idHorario 
        inner join aulas au on h.idAula = au.idAula 
        inner join detallehorario d on d.idHorario = h.idHorario 
        inner join materia m on d.idMateria = m.idMateria 
        inner join profesores p on d.idProfesor = p.idProfesor where i.idAlumno = ?
    order by d.horaInicio`, [idA], (err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.render('horariosAlumno', { data: result , title : 'Horario',})
    })

}

//Se exporta una funcion que se encargara de cargar las notas de el alumno
export const notasAlumno = async (req, res) => {
    const {idA} = req.params
    cnn.query(`
    select c.parcial1,
    m.nombreMateria , 
    a.nombres , 
    c.parcial2 ,
    c.parcial3 , 
    c.parcial4 from calificacion as c 
    inner join alumnos as a on c.idAlumno = a.idAlumno 
    inner join materia as m on c.IdMateria = m.idMateria where c.idAlumno = ?`,[idA] ,(err, result) => {
        if (err) {
            console.log("Ocurrio un error", err);
            return
        }
        res.render('notasAlumno', { data: result, title : 'Calificaciones' })
    })

}


