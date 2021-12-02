import express from 'express' 
import { HorariosAlumno, notasAlumno } from '../controllers/horariosNotasAlumno.js'; //Mandamos a llamar la funcion con la cual se va asociar la ruta
const router = express.Router()

// la ruta y la funcion que voy asociarles desde controlers
router.get('/horariosAlumno', HorariosAlumno);  

router.get('/NotasAlumno', notasAlumno);


export default router;