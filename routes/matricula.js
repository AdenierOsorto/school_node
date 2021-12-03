import express from 'express'
import { isAuthenticated } from '../controllers/authLogin.js';
import { inicioMatricula, cargarAddMatricula, agregarMatricula, cargarEditMatricula, editarMatricula, eliminarMatricula} from '../controllers/matricula.js';
const router = express.Router()

router.get('/adminMatricula', isAuthenticated, inicioMatricula);

router.get('/addMatricula', isAuthenticated, cargarAddMatricula)

router.post('/addMatricula', isAuthenticated, agregarMatricula)

router.get('/editMatricula/:idMatricula', isAuthenticated, cargarEditMatricula)

router.post('/editMatricula/editMatricula', isAuthenticated, editarMatricula)

router.post('/deleteMatricula/:idMatricula&:idAlumno', isAuthenticated, eliminarMatricula)

export default router;