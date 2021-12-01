import express from 'express'
import { inicioMatricula, cargarAddMatricula, agregarMatricula, cargarEditMatricula, editarMatricula, eliminarMatricula} from '../controllers/matricula.js';
const router = express.Router()

router.get('/adminMatricula', inicioMatricula);

router.get('/addMatricula', cargarAddMatricula)

router.post('/addMatricula', agregarMatricula)

router.get('/editMatricula/:idMatricula', cargarEditMatricula)

router.post('/editMatricula/editMatricula',editarMatricula)

router.post('/deleteMatricula/:idMatricula&:idAlumno', eliminarMatricula)

export default router;