import express from 'express'
import { guardarProfesor, profesor, profesores } from '../controllers/profesores.js';
const router = express.Router()

router.get('/profesores', profesores);

router.get('/profesor', profesor);

router.post('/profesor/guardar', guardarProfesor)
export default router;