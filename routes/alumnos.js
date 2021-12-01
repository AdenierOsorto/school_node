import express from 'express'
import { alumno, editarAlumno, eliminarAlumno, guardarAlumno, listarA } from '../controllers/alumnos.js'
import { profile, updateImg } from '../controllers/perfil.js'
const router = express.Router()

//Redirige la ruta raíz, con los datos de la función listarA()
router.get('/',listarA)

//Redirige la ruta '/alumno', con los datos de la función alumno()
router.get('/alumno',alumno)

//Redirige la ruta raiz luego de almacenar los datos de la función guardarAlumno()
router.post('/alumno/guardar',guardarAlumno)

//Ruta para eliminar un alummo utlizando la función eliminarAlumno()
router.delete('/alumno/eliminar',eliminarAlumno)

//Ruta para editar un alummo utlizando la función editarAlumno()
router.post('/alumno/editar',editarAlumno)

//Ruta para acceder al perfíl del alumno utlizando la función profile()
router.get('/perfil',profile)

//Ruta para cambiar la foto de perfíl del alumno utlizando la función updateImg()
router.post('/perfil/updateImg',updateImg)

export default router