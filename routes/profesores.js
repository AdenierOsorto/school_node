import express from 'express'
import { editarProfesor, eliminarProfesor, guardarProfesor, profesor, profesores } from '../controllers/profesores.js';
const router = express.Router()

router.get('/', profesores);

router.get('/profesor', profesor);

router.post('/profesor/guardar', guardarProfesor)

router.post('/profesor/editar', editarProfesor)

router.delete('/profesor/eliminar', eliminarProfesor)
export default router;