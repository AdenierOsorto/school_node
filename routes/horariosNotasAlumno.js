import express from 'express' 
import { isAuthenticated } from '../controllers/authLogin.js';
import { HorariosAlumno, notasAlumno } from '../controllers/horariosNotasAlumno.js'; //Mandamos a llamar la funcion con la cual se va asociar la ruta
const router = express.Router()

// la ruta y la funcion que voy asociarles desde controlers
router.get('/horariosAlumno/:idA', isAuthenticated, HorariosAlumno);  

router.get('/NotasAlumno/:idA', isAuthenticated, notasAlumno);


export default router;