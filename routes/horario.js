import express from 'express'
import { inicioHorario, cargarAddHorario, cargarEditHorario, agregarHorario,editarHorario, eliminarHorario } from '../controllers/horario.js';
const router = express.Router()

router.get('/adminHorario', inicioHorario);

router.get('/addHorario', cargarAddHorario)

router.post('/addHorario', agregarHorario)

router.get('/editHorario/:idHorario', cargarEditHorario)

router.post('/editHorario/editHorario',editarHorario)

router.post('/deleteHorario/:idHorario', eliminarHorario)

export default router;