import express from 'express'
import { isAuthenticated } from '../controllers/authLogin.js';
import { listarClases , listarAlumnosClase, calificacionAlumno, editarcalificacionAlumno ,guardarcalificacionAlguarumno} from '../controllers/clasesProfesor.js';
const router = express.Router()

//peticiones get
router.get('/clasesProfesor/:idM', isAuthenticated,listarClases)
router.get('/clasesAlumnos/:id/:idM', isAuthenticated,listarAlumnosClase)
router.get('/calificacionAlumnos/:idA/:idM/:idP', isAuthenticated,calificacionAlumno)
router.get('/editarCalificacionAlumno/:idA/:idM/:idP', isAuthenticated,editarcalificacionAlumno)



//peticiones Post
router.post('/guardarCalificacaionAlumno/:idA/:idM/:idP', isAuthenticated,guardarcalificacionAlguarumno)



export default router;