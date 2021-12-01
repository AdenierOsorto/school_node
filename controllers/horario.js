import cnn from "../database/connection.js"

//====================================================================================================================================
// Extrae los datos de los horarios para llenar las tablas
export const inicioHorario = async (req, res) => {
    cnn.query(`SELECT h.idHorario, h.descripcion, a.nombreAula FROM horario h INNER JOIN aulas a on h.idAula = a.idAula;`, (err, result) => {
        if (err) {
            console.log("Ocurrio un error al consultar el horario", err);
            return
        }
        else{
            cnn.query(`select concat(DATE_FORMAT(dh.horaInicio,"%H:%i"),"-",DATE_FORMAT(dh.horaFin,"%H:%i")) Hora, dh.idHorario,
                        MAX(CASE WHEN dh.dia = 'Lunes' THEN concat(m.nombreMateria," - ",concat(p.nombreProfesor," ",p.apellidoProfesor)) ELSE '' END) Lunes,
                        MAX(CASE WHEN dh.dia = 'Martes' THEN concat(m.nombreMateria," - ",concat(p.nombreProfesor," ",p.apellidoProfesor)) ELSE '' END) Martes,
                        MAX(CASE WHEN dh.dia = 'Miercoles' THEN concat(m.nombreMateria," - ",concat(p.nombreProfesor," ",p.apellidoProfesor)) ELSE '' END) Miercoles,
                        MAX(CASE WHEN dh.dia = 'Jueves' THEN concat(m.nombreMateria," - ",concat(p.nombreProfesor," ",p.apellidoProfesor)) ELSE '' END) Jueves,
                        MAX(CASE WHEN dh.dia = 'Viernes' THEN concat(m.nombreMateria," - ",concat(p.nombreProfesor," ",p.apellidoProfesor)) ELSE '' END) Viernes
                from detallehorario dh inner join materia m on dh.idMateria = m.idMateria 
                inner join profesores p on p.idProfesor = dh.idProfesor 
                group by concat(DATE_FORMAT(dh.horaInicio,"%H:%i"),"-",DATE_FORMAT(dh.horaFin,"%H:%i")),dh.idHorario
                order by concat(DATE_FORMAT(dh.horaInicio,"%H:%i"),"-",DATE_FORMAT(dh.horaFin,"%H:%i")) asc`,(err,datos)=>{
                if (err) {
                    console.log("Ocurrio un error al consultar el detalle de horario")
                    return
                } else {
                    res.render('adminHorario', { horario: result, detalle:datos })
                }
            })
        }
    })
}

//====================================================================================================================================
// Carga los datos para llenar los selects para agregar el horario
export const cargarAddHorario = async (req, res) => {
    cnn.query("SELECT * FROM aulas",function(err,Aulas){
        if (err) {
            console.log("No se pudieron cargar las aulas")
            return
        } else{
            cnn.query("SELECT * FROM profesores",function(err,profesores){
                if (err) {
                    console.log("No se pudieron cargar los profesores")
                    return
                } else{
                    cnn.query("SELECT * FROM materia",function(err,Materias){
                        if (err) {
                            console.log("No se pudieron cargar las materias")
                            return
                        } else{
                            res.render('addHorario', { dataAulas: Aulas, dataProfesores: profesores, dataMaterias: Materias })
                        }
                    }) 
                }
            }) 
        }
    }) 
}

//====================================================================================================================================
// Inserción del horario y el detalle horario
export const agregarHorario = async(req,res) => {
    const {idAula,descripcionHorario,jornada,
        lIdMateria1,lIdMateria2,lIdMateria3,lIdMateria4,lIdProfesor1,lIdProfesor2,lIdProfesor3,lIdProfesor4,
        mIdMateria1,mIdMateria2,mIdMateria3,mIdMateria4,mIdProfesor1,mIdProfesor2,mIdProfesor3,mIdProfesor4,
        miIdMateria1,miIdMateria2,miIdMateria3,miIdMateria4,miIdProfesor1,miIdProfesor2,miIdProfesor3,miIdProfesor4,
        jIdMateria1,jIdMateria2,jIdMateria3,jIdMateria4,jIdProfesor1,jIdProfesor2,jIdProfesor3,jIdProfesor4,
        vIdMateria1,vIdMateria2,vIdMateria3,vIdMateria4,vIdProfesor1,vIdProfesor2,vIdProfesor3,vIdProfesor4
        } = req.body

    //construccion del query
    cnn.query("INSERT INTO horario (descripcion, idAula) VALUES(?, ?);",[descripcionHorario,idAula],(err,result)=>{

        if (err) {
            console.log('Ocurrio un error al agregar el horario')
            return
        }else{

            // query para buscar el ultimo registro de horario
            cnn.query("select idHorario from horario order by idHorario desc limit 1;",(err, result) =>{
                if (err) {
                    console.log('Ocurrio un error al buscar el ultimo horario agregado')
                    return
                }else{
                    
                    const idHorario = result[0].idHorario
                    if (jornada==1) {
                        var data = {
                            horarioId: [idHorario,idHorario,idHorario,idHorario,idHorario,
                                idHorario,idHorario,idHorario,idHorario,idHorario,
                                idHorario,idHorario,idHorario,idHorario,idHorario,
                                idHorario,idHorario,idHorario,idHorario,idHorario,
                                idHorario,idHorario,idHorario,idHorario,idHorario],
                            materiaId: [lIdMateria1,lIdMateria2,"1",lIdMateria3,lIdMateria4,
                                mIdMateria1,mIdMateria2,"1",mIdMateria3,mIdMateria4,
                                miIdMateria1,miIdMateria2,"1",miIdMateria3,miIdMateria4,
                                jIdMateria1,jIdMateria2,"1",jIdMateria3,jIdMateria4,
                                vIdMateria1,vIdMateria2,"1",vIdMateria3,vIdMateria4],
                            dia: ["Lunes","Lunes","Lunes","Lunes","Lunes",
                            "Martes","Martes","Martes","Martes","Martes",
                            "Miercoles","Miercoles","Miercoles","Miercoles","Miercoles",
                            "Jueves","Jueves","Jueves","Jueves","Jueves",
                            "Viernes","Viernes","Viernes","Viernes","Viernes"],
                            horaInicio: ["07:00","08:00","09:00","10:00","11:00",
                            "07:00","08:00","09:00","10:00","11:00",
                            "07:00","08:00","09:00","10:00","11:00",
                            "07:00","08:00","09:00","10:00","11:00",
                            "07:00","08:00","09:00","10:00","11:00"],
                            horaFin: ["07:55","08:55","09:55","10:55","11:55",
                            "07:55","08:55","09:55","10:55","11:55",
                            "07:55","08:55","09:55","10:55","11:55",
                            "07:55","08:55","09:55","10:55","11:55",
                            "07:55","08:55","09:55","10:55","11:55"],
                            profesorId: [lIdProfesor1,lIdProfesor2,"1",lIdProfesor3,lIdProfesor4,
                                mIdProfesor1,mIdProfesor2,"1",mIdProfesor3,mIdProfesor4,
                                miIdProfesor1,miIdProfesor2,"1",miIdProfesor3,miIdProfesor4,
                                jIdProfesor1,jIdProfesor2,"1",jIdProfesor3,jIdProfesor4,
                                vIdProfesor1,vIdProfesor2,"1",vIdProfesor3,vIdProfesor4]
                        }
                    } else {
                        var data = {
                            horarioId: [idHorario,idHorario,idHorario,idHorario,idHorario,
                                idHorario,idHorario,idHorario,idHorario,idHorario,
                                idHorario,idHorario,idHorario,idHorario,idHorario,
                                idHorario,idHorario,idHorario,idHorario,idHorario,
                                idHorario,idHorario,idHorario,idHorario,idHorario],
                            materiaId: [lIdMateria1,lIdMateria2,"1",lIdMateria3,lIdMateria4,
                                mIdMateria1,mIdMateria2,"1",mIdMateria3,mIdMateria4,
                                miIdMateria1,miIdMateria2,"1",miIdMateria3,miIdMateria4,
                                jIdMateria1,jIdMateria2,"1",jIdMateria3,jIdMateria4,
                                vIdMateria1,vIdMateria2,"1",vIdMateria3,vIdMateria4],
                            dia: ["Lunes","Lunes","Lunes","Lunes","Lunes",
                            "Martes","Martes","Martes","Martes","Martes",
                            "Miercoles","Miercoles","Miercoles","Miercoles","Miercoles",
                            "Jueves","Jueves","Jueves","Jueves","Jueves",
                            "Viernes","Viernes","Viernes","Viernes","Viernes"],
                            horaInicio: ["13:00","14:00","15:00","16:00","17:00",
                            "13:00","14:00","15:00","16:00","17:00",
                            "13:00","14:00","15:00","16:00","17:00",
                            "13:00","14:00","15:00","16:00","17:00",
                            "13:00","14:00","15:00","16:00","17:00"],
                            horaFin: ["13:55","14:55","15:55","16:55","17:55",
                            "13:55","14:55","15:55","16:55","17:55",
                            "13:55","14:55","15:55","16:55","17:55",
                            "13:55","14:55","15:55","16:55","17:55",
                            "13:55","14:55","15:55","16:55","17:55"],
                            profesorId: [lIdProfesor1,lIdProfesor2,"1",lIdProfesor3,lIdProfesor4,
                                mIdProfesor1,mIdProfesor2,"1",mIdProfesor3,mIdProfesor4,
                                miIdProfesor1,miIdProfesor2,"1",miIdProfesor3,miIdProfesor4,
                                jIdProfesor1,jIdProfesor2,"1",jIdProfesor3,jIdProfesor4,
                                vIdProfesor1,vIdProfesor2,"1",vIdProfesor3,vIdProfesor4]
                        }
                    }
                    
                    // Query para insertar el detalle horario
                    for (let index = 0; index < 25; index++) {
                        cnn.query(`INSERT INTO detallehorario (idHorario, idMateria, dia, horaInicio, horaFin, idProfesor) VALUES(?, ?, ?, ?, ?, ?);`,[data["horarioId"][index],data["materiaId"][index],data["dia"][index],data["horaInicio"][index],data["horaFin"][index],data["profesorId"][index]],(err, result) =>{
                            if (err) {
                                console.log('Ocurrio un error al agregar el detalle horario')
                                return
                            }
                        })
                        
                    }
                    res.redirect("adminHorario")
                }
            })
        }
    })
}

//====================================================================================================================================
// Cargar editar horario
export const cargarEditHorario = async (req, res) => {
    cnn.query(`select dh.idDetalleHorario, h.descripcion, a.idAula, a.nombreAula,dh.horaInicio, h.idHorario, m.idMateria, m.nombreMateria, p.idProfesor, concat(p.nombreProfesor," ",p.apellidoProfesor) profesor, dh.dia from 
            detallehorario dh inner join horario h on dh.idHorario = h.idHorario 
            inner join aulas a on h.idAula = a.idAula
            inner join materia m on m.idMateria = dh.idMateria 
            inner join profesores p on p.idProfesor = dh.idProfesor 
            where h.idHorario = ?
            order by dh.dia asc`,req.params.idHorario,function(err,horario){
        if (err) {
            console.log("No se pudieron cargar las materias")
            return
        } else{
            cnn.query("SELECT * FROM aulas",function(err,Aulas){
                if (err) {
                    console.log("No se pudieron cargar las aulas")
                    return
                } else{
                    cnn.query("SELECT * FROM profesores",function(err,profesores){
                        if (err) {
                            console.log("No se pudieron cargar los profesores")
                            return
                        } else{
                            cnn.query("SELECT * FROM materia",function(err,Materias){
                                if (err) {
                                    console.log("No se pudieron cargar las materias")
                                    return
                                } else{
                                    res.render('editHorario', { dataHorario: horario, dataAulas: Aulas, dataProfesores: profesores, dataMaterias: Materias })
                                }
                            }) 
                        }
                    }) 
                }
            })
        }
    }) 
}

//====================================================================================================================================
// Edición del horario y el detalle horario
export const editarHorario = async(req,res) => {
    const {idAula,descripcionHorario,jornada, idHorario,
        lIdRecreo,lIdDetalle1,lIdDetalle2,lIdDetalle3,lIdDetalle4,lIdMateria1,lIdMateria2,lIdMateria3,lIdMateria4,lIdProfesor1,lIdProfesor2,lIdProfesor3,lIdProfesor4,
        mIdRecreo,mIdDetalle1,mIdDetalle2,mIdDetalle3,mIdDetalle4,mIdMateria1,mIdMateria2,mIdMateria3,mIdMateria4,mIdProfesor1,mIdProfesor2,mIdProfesor3,mIdProfesor4,
        miIdRecreo,miIdDetalle1,miIdDetalle2,miIdDetalle3,miIdDetalle4,miIdMateria1,miIdMateria2,miIdMateria3,miIdMateria4,miIdProfesor1,miIdProfesor2,miIdProfesor3,miIdProfesor4,
        jIdRecreo,jIdDetalle1,jIdDetalle2,jIdDetalle3,jIdDetalle4,jIdMateria1,jIdMateria2,jIdMateria3,jIdMateria4,jIdProfesor1,jIdProfesor2,jIdProfesor3,jIdProfesor4,
        vIdRecreo,vIdDetalle1,vIdDetalle2,vIdDetalle3,vIdDetalle4,vIdMateria1,vIdMateria2,vIdMateria3,vIdMateria4,vIdProfesor1,vIdProfesor2,vIdProfesor3,vIdProfesor4
        } = req.body

    //construccion del query
    cnn.query("UPDATE horario SET descripcion=?, idAula=? WHERE idHorario=?;",[descripcionHorario,idAula,idHorario],(err,result)=>{

        if (err) {
            console.log('Ocurrio un error al editar el horario')
            return
        }else{
            if (jornada==1) {
                var data = {
                    materiaId: [lIdMateria1,lIdMateria2,"1",lIdMateria3,lIdMateria4,
                        mIdMateria1,mIdMateria2,"1",mIdMateria3,mIdMateria4,
                        miIdMateria1,miIdMateria2,"1",miIdMateria3,miIdMateria4,
                        jIdMateria1,jIdMateria2,"1",jIdMateria3,jIdMateria4,
                        vIdMateria1,vIdMateria2,"1",vIdMateria3,vIdMateria4],
                    dia: ["Lunes","Lunes","Lunes","Lunes","Lunes",
                    "Martes","Martes","Martes","Martes","Martes",
                    "Miercoles","Miercoles","Miercoles","Miercoles","Miercoles",
                    "Jueves","Jueves","Jueves","Jueves","Jueves",
                    "Viernes","Viernes","Viernes","Viernes","Viernes"],
                    horaInicio: ["07:00","08:00","09:00","10:00","11:00",
                    "07:00","08:00","09:00","10:00","11:00",
                    "07:00","08:00","09:00","10:00","11:00",
                    "07:00","08:00","09:00","10:00","11:00",
                    "07:00","08:00","09:00","10:00","11:00"],
                    horaFin: ["07:55","08:55","09:55","10:55","11:55",
                    "07:55","08:55","09:55","10:55","11:55",
                    "07:55","08:55","09:55","10:55","11:55",
                    "07:55","08:55","09:55","10:55","11:55",
                    "07:55","08:55","09:55","10:55","11:55"],
                    profesorId: [lIdProfesor1,lIdProfesor2,"1",lIdProfesor3,lIdProfesor4,
                        mIdProfesor1,mIdProfesor2,"1",mIdProfesor3,mIdProfesor4,
                        miIdProfesor1,miIdProfesor2,"1",miIdProfesor3,miIdProfesor4,
                        jIdProfesor1,jIdProfesor2,"1",jIdProfesor3,jIdProfesor4,
                        vIdProfesor1,vIdProfesor2,"1",vIdProfesor3,vIdProfesor4],
                    detalleId: [lIdDetalle1,lIdDetalle2,lIdRecreo,lIdDetalle3,lIdDetalle4,
                        mIdDetalle1,mIdDetalle2,mIdRecreo,mIdDetalle3,mIdDetalle4,
                        miIdDetalle1,miIdDetalle2,miIdRecreo,miIdDetalle3,miIdDetalle4,
                        jIdDetalle1,jIdDetalle2,jIdRecreo,jIdDetalle3,jIdDetalle4,
                        vIdDetalle1,vIdDetalle2,vIdRecreo,vIdDetalle3,vIdDetalle4]
                }
            } else {
                var data = {
                    materiaId: [lIdMateria1,lIdMateria2,"1",lIdMateria3,lIdMateria4,
                        mIdMateria1,mIdMateria2,"1",mIdMateria3,mIdMateria4,
                        miIdMateria1,miIdMateria2,"1",miIdMateria3,miIdMateria4,
                        jIdMateria1,jIdMateria2,"1",jIdMateria3,jIdMateria4,
                        vIdMateria1,vIdMateria2,"1",vIdMateria3,vIdMateria4],
                    dia: ["Lunes","Lunes","Lunes","Lunes","Lunes",
                    "Martes","Martes","Martes","Martes","Martes",
                    "Miercoles","Miercoles","Miercoles","Miercoles","Miercoles",
                    "Jueves","Jueves","Jueves","Jueves","Jueves",
                    "Viernes","Viernes","Viernes","Viernes","Viernes"],
                    horaInicio: ["13:00","14:00","15:00","16:00","17:00",
                    "13:00","14:00","15:00","16:00","17:00",
                    "13:00","14:00","15:00","16:00","17:00",
                    "13:00","14:00","15:00","16:00","17:00",
                    "13:00","14:00","15:00","16:00","17:00"],
                    horaFin: ["13:55","14:55","15:55","16:55","17:55",
                    "13:55","14:55","15:55","16:55","17:55",
                    "13:55","14:55","15:55","16:55","17:55",
                    "13:55","14:55","15:55","16:55","17:55",
                    "13:55","14:55","15:55","16:55","17:55"],
                    profesorId: [lIdProfesor1,lIdProfesor2,"1",lIdProfesor3,lIdProfesor4,
                        mIdProfesor1,mIdProfesor2,"1",mIdProfesor3,mIdProfesor4,
                        miIdProfesor1,miIdProfesor2,"1",miIdProfesor3,miIdProfesor4,
                        jIdProfesor1,jIdProfesor2,"1",jIdProfesor3,jIdProfesor4,
                        vIdProfesor1,vIdProfesor2,"1",vIdProfesor3,vIdProfesor4],
                    detalleId: [lIdDetalle1,lIdDetalle2,lIdRecreo,lIdDetalle3,lIdDetalle4,
                        mIdDetalle1,mIdDetalle2,mIdRecreo,mIdDetalle3,mIdDetalle4,
                        miIdDetalle1,miIdDetalle2,miIdRecreo,miIdDetalle3,miIdDetalle4,
                        jIdDetalle1,jIdDetalle2,jIdRecreo,jIdDetalle3,jIdDetalle4,
                        vIdDetalle1,vIdDetalle2,vIdRecreo,vIdDetalle3,vIdDetalle4]
                }
            }
            
            // Query para insertar el detalle horario
            for (let index = 0; index < 25; index++) {
                cnn.query(`UPDATE detallehorario
                SET idMateria=?, dia=?, horaInicio=?, horaFin=?, idProfesor=?
                WHERE idDetalleHorario=?;
                `,[data["materiaId"][index],data["dia"][index],data["horaInicio"][index],data["horaFin"][index],data["profesorId"][index],data["detalleId"][index]],(err, result) =>{
                    if (err) {
                        console.log('Ocurrio un error al editar el detalle horario')
                        return
                    }
                })
                
            }
            res.redirect("../adminHorario")
        }
    })
}

//====================================================================================================================================
// Eliminación del horario y el detalle horario

export const eliminarHorario = async (req, res) => {
    cnn.query("SELECT * FROM horario WHERE idHorario=?",req.params.idHorario,function(err){
        if (err) {
            console.log('No se encontro el Horario')
            return
        }
        else{
            cnn.query("DELETE FROM detallehorario WHERE idHorario=?;",req.params.idHorario, function(err){
                if(err){
                    console.log('Ocurrio un error al eliminar el detalle Horario')
                    return
                }else{
                    cnn.query("DELETE FROM horario WHERE idHorario=?;",req.params.idHorario, function(err){
                        if(err){
                            console.log('Ocurrio un error al eliminar el Horario')
                            return
                        }else{
                            res.redirect('../adminHorario')
                        }
                    })
                }
            })
        }
    })
}