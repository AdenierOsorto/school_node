import express from 'express'
import { listarClases , listarAlumnosClase, calificacionAlumno, editarcalificacionAlumno ,guardarcalificacionAlguarumno} from '../controllers/clasesProfesor.js';
const router = express.Router()

//peticiones get
router.get('/clasesProfesor', listarClases)
router.get('/clasesAlumnos/:id', listarAlumnosClase)
router.get('/calificacionAlumnos/:idA/:idM', calificacionAlumno)
router.get('/editarCalificacionAlumno/:idA/:idM', editarcalificacionAlumno)



//peticiones Post
router.post('/guardarCalificacaionAlumno/:idA/:idM', guardarcalificacionAlguarumno)



export default router;