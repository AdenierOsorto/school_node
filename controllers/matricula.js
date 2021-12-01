import cnn from "../database/connection.js"

//====================================================================================================================================
// Extrae los datos de los horarios para llenar las tablas
export const inicioMatricula = async (req, res) => {
    cnn.query(`select a.idAlumno, a.DNI, i.idInscripcion, date_format(i.fechaInscripcion, "%d-%m-%Y") fecha, concat(a.nombres," ",a.apellidos) alumno, h.descripcion, au.nombreAula 
    from inscripcion i inner join horario h on h.idHorario = i.idHorario
    inner join alumnos a on a.idAlumno = i.idAlumno 
    inner join aulas au on au.idAula = h.idAula `, (err, result) => {
        if (err) {
            console.log("Ocurrio un error al consultar la matricula", err);
            return
        }
        else{
            res.render('adminMatricula', { matricula: result }) 
        }
    })
}

//====================================================================================================================================
// Carga los datos, para llenar los selects, para agregar la matricula
export const cargarAddMatricula = async (req, res) => {
    cnn.query("SELECT * FROM alumnos",function(err,alumnos){
        if (err) {
            console.log("No se pudieron cargar las aulas")
            return
        } else{
            cnn.query("select h.idHorario, h.descripcion, a.nombreAula from horario h inner join aulas a on h.idAula = a.idAula;",function(err,horarios){
                if (err) {
                    console.log("No se pudieron cargar los profesores")
                    return
                } else{
                    res.render('addMatricula', { dataAlumnos: alumnos, dataHorarios: horarios }) 
                }
            }) 
        }
    }) 
}

//====================================================================================================================================
// Inserción de la matricula y la calificación inicial
export const agregarMatricula = async (req, res) => {
    const {idAlumno, idHorario} = req.body
    const fecha = new Date()
    const fechaInscripcion = (fecha.getFullYear() + "/" + + (fecha.getMonth() +1)  + "/" + fecha.getDate() );

    const dataInscripcion = {
        fechaI:fechaInscripcion,
        alumnoId:idAlumno,
        horarioId:idHorario
    }

    cnn.query("INSERT INTO inscripcion (fechaInscripcion, idAlumno, idHorario) VALUES(?, ?, ?);",[dataInscripcion.fechaI,dataInscripcion.alumnoId,dataInscripcion.horarioId],function(err){
        if (err) {
            console.log("No se pudo agregar la matricula")
            return
        } else{
            cnn.query(`select idMateria from detallehorario where idHorario = ? and idMateria != 1 group by idMateria;`,[idHorario],function(err,materias){
                if (err) {
                    console.log("No se encontro el horario")
                    return
                } else{
                    for (let index = 0; index < materias.length; index++) {
                        const dataCalificacion = {
                            materiaId: materias[index].idMateria,
                            alumnoId: idAlumno
                        }

                        cnn.query(`INSERT INTO calificacion
                        (IdMateria, idAlumno)
                        VALUES(?, ?);`,[dataCalificacion.materiaId, dataCalificacion.alumnoId],function(err){
                            if (err) {
                                console.log("No se pudo agregar la calificación")
                                return
                            } 
                        })
                    } 
                    res.redirect("adminMatricula")
                }
            }) 
        }
    }) 
}

//====================================================================================================================================
// Cargar edición de la matricula
export const cargarEditMatricula = async (req, res) => {
    cnn.query(`select i.idInscripcion, h.idHorario, h.descripcion, a.nombreAula, al.idAlumno, concat(al.nombres, " ", al.apellidos) alumno
    from horario h inner join aulas a on h.idAula = a.idAula
    inner join inscripcion i on i.idHorario = h.idHorario 
    inner join alumnos al on al.idAlumno = i.idAlumno 
    where i.idInscripcion = ?;`,req.params.idMatricula,function(err,matricula){
        if (err) {
            console.log("No se pudieron cargar los profesores")
            return
        } else{
            cnn.query("SELECT * FROM alumnos",function(err,alumnos){
                if (err) {
                    console.log("No se pudieron cargar las aulas")
                    return
                } else{
                    cnn.query("select h.idHorario, h.descripcion, a.nombreAula from horario h inner join aulas a on h.idAula = a.idAula;",function(err,horarios){
                        if (err) {
                            console.log("No se pudieron cargar los profesores")
                            return
                        } else{
                            res.render('editMatricula', { dataAlumnos: alumnos, dataHorarios: horarios,dataMatricula:matricula }) 
                        }
                    }) 
                }
            }) 
        }
    }) 
}

//====================================================================================================================================
// Edición de la matricula y la calificación inicial
export const editarMatricula = async (req, res) => {
    const {idAlumno, idHorario, idMatricula} = req.body
    console.log(idAlumno,idHorario,idMatricula)

    cnn.query("UPDATE inscripcion SET idHorario=? WHERE idInscripcion=?;",[idHorario,idMatricula],function(err){
        if (err) {
            console.log("No se pudo editar la matricula")
            return
        } else{
            cnn.query(`select idMateria from detallehorario where idHorario = ? and idMateria != 1 group by idMateria;`,[idHorario],function(err,materias){
                if (err) {
                    console.log("No se encontro el horario")
                    return
                } else{
                    for (let index = 0; index < materias.length; index++) {
                        const dataCalificacion = {
                            materiaId: materias[index].idMateria,
                            alumnoId: idAlumno
                        }

                        cnn.query(`DELETE FROM calificacion
                        WHERE idAlumno=?;`,[idAlumno],function(err){
                            if (err) {
                                console.log("No se pudo eliminar la calificacion anterior")
                                return
                            } else{
                                cnn.query(`INSERT INTO calificacion
                                (IdMateria, idAlumno)
                                VALUES(?, ?);`,[dataCalificacion.materiaId, dataCalificacion.alumnoId],function(err){
                                    if (err) {
                                        console.log("No se pudo cambiar la calificación")
                                        return
                                    } 
                                })
                            }
                        })
                    } 
                    res.redirect("../adminMatricula")
                }
            }) 
        }
    }) 
}

//====================================================================================================================================
// Eliminación de la inscripcion y calificación

export const eliminarMatricula = async (req, res) => {
    cnn.query("SELECT * FROM inscripcion WHERE idInscripcion=?",req.params.idMatricula,function(err){
        if (err) {
            console.log('No se encontro la Matricula')
            return
        }
        else{
            cnn.query("DELETE FROM calificacion WHERE idAlumno=?;",req.params.idAlumno, function(err){
                if(err){
                    console.log('Ocurrio un error al eliminar la calificación')
                    return
                }else{
                    cnn.query("DELETE FROM inscripcion WHERE idInscripcion=?;",req.params.idMatricula, function(err){
                        if(err){
                            console.log('Ocurrio un error al eliminar el Horario')
                            return
                        }else{
                            res.redirect('../adminMatricula')
                        }
                    })
                }
            })
        }
    })
}