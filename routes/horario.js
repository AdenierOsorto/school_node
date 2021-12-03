import express from 'express'
import { isAuthenticated } from '../controllers/authLogin.js';
import { inicioHorario, cargarAddHorario, cargarEditHorario, agregarHorario,editarHorario, eliminarHorario } from '../controllers/horario.js';
const router = express.Router()

router.get('/adminHorario', isAuthenticated, inicioHorario);

router.get('/addHorario', isAuthenticated, cargarAddHorario)

router.post('/addHorario', isAuthenticated, agregarHorario)

router.get('/editHorario/:idHorario', isAuthenticated, cargarEditHorario)

router.post('/editHorario/editHorario', isAuthenticated, editarHorario)

router.post('/deleteHorario/:idHorario', isAuthenticated, eliminarHorario)

export default router;