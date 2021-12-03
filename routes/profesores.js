import express from 'express'
import { isAuthenticated } from '../controllers/authLogin.js';
import { editarProfesor, eliminarProfesor, guardarProfesor, profesor, profesores } from '../controllers/profesores.js';
const router = express.Router()

router.get('/', isAuthenticated, profesores);

router.get('/profesor', isAuthenticated, profesor);

router.post('/profesor/guardar', isAuthenticated, guardarProfesor)

router.post('/profesor/editar', isAuthenticated, editarProfesor)

router.delete('/profesor/eliminar', isAuthenticated, eliminarProfesor)
export default router;