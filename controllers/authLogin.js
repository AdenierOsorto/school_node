import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import con from '../database/connection.js'

var session

export const login = async (req, res) => {
    const { username, password } = req.body
    // valida si los parametros estan completos
    if (!username || !password) {
        res.render('base')
        return;
    }

    // query a la base de datos para verificar que exista el profesor
    con.query('SELECT * FROM profesores WHERE DNI = ? and password = ?;', [username, password], async (err, result) => {
        // validar el error
        if(err){
            console.log(`${err}`);
        }
        // evaluaciones cortocircuiteadas
        // validar si el usuario existe, de existir validar si la contrasena es correcta
        if (result.length === 0 ) {
            con.query('SELECT * FROM alumnos WHERE DNI = ? and password = ?;', [username, password],  async (err, resultAlumno) =>{
                if(err){
                    console.log(`${err}`);
                    res.render('base')
                    return
                }
                if(resultAlumno.length === 0){
                    res.render('base')
                    return
                }
                const id = resultAlumno[0].idAlumno
                console.log(process.env.JWT_SECRET)
                const token = jwt.sign({id: id}, process.env.JWT_SECRET)
        
                // // guardar en la sesion el token generado
                session = req.session
                session.token = token
                // el user y password son correctos, podemos continuar
                res.redirect('/')
            })
        }else{
            // crear el token usando el id del usuario
            const id = result[0].idProfesor
            const token = jwt.sign({id: id}, process.env.JWT_SECRET)
    
            // // guardar en la sesion el token generado
            session = req.session
            session.token = token
            // el user y password son correctos, podemos continuar
            res.redirect('/')
        }
    })
    
    
}

// elimina la cookie y cierra la sesion
export const logout = (req, res) => {
    req.session.destroy()
    res.redirect('/login')
}


// Creando un middleware para proteger las URL que necesitan inicio de sesion
export const isAuthenticated = async (req, res, next) => {
    if (req.session.token) {
        // validar que el token le pertenezca al usuario
        const verifyPromise = await promisify(jwt.verify)
        const decoded = await verifyPromise(req.session.token, process.env.JWT_SECRET)

        // decoded: {id: <id del user en base de datos>}
        const userID = decoded.id

        // consultar en la base de datos si el usuario que se decodificó del token, existe
        con.query('SELECT * FROM profesores WHERE idProfesor = ?', [userID], (err, result) => {
            if (err) {
                return res.redirect('/login')
            }
            if (result.length === 0) {
                con.query('SELECT * FROM alumnos WHERE idAlumno = ?', [userID], (err, resultAlumno) => {
                    if(err){
                        console.log(`${err}`);
                        return res.redirect('/login')
                    }
                    if(resultAlumno.length === 0){
                        return res.redirect('/login')
                    }
                    // se inserta la informacion en la sesion
                    session = req.session
                    session.user = resultAlumno[0]
                    session.user.tipo = "al";
                    next()
                })
            }else{
                // el usuario existe
                session = req.session
                session.user = result[0]
                session.user.tipo = "p";
                next()
            }

        })

        
    }
    else {
        // el token no exite, por tanto, no se ha iniciado sesion
        return res.redirect('/login')
    }
}

// Creando un middleware que monitoree todas las peticiones
export const logger = (req, res, next) => {
    console.log(req.path, req.method)
    // console.log('La peticion ha sido interceptada y sigue su rumbo')
    next()
}