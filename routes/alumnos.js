import express from 'express'
import { alumno, editarAlumno, eliminarAlumno, guardarAlumno, listarA } from '../controllers/alumnos.js'
import { isAuthenticated } from '../controllers/authLogin.js'
import { profile, updateImg } from '../controllers/perfil.js'
const router = express.Router()

//Redirige la ruta raíz, con los datos de la función listarA()
router.get('/', isAuthenticated,listarA)

//Redirige la ruta '/alumno', con los datos de la función alumno()
router.get('/alumno', isAuthenticated,alumno)

//Redirige la ruta raiz luego de almacenar los datos de la función guardarAlumno()
router.post('/alumno/guardar', isAuthenticated,guardarAlumno)

//Ruta para eliminar un alummo utlizando la función eliminarAlumno()
router.delete('/alumno/eliminar', isAuthenticated,eliminarAlumno)

//Ruta para editar un alummo utlizando la función editarAlumno()
router.post('/alumno/editar', isAuthenticated,editarAlumno)

//Ruta para acceder al perfíl del alumno utlizando la función profile()
router.get('/perfil', isAuthenticated,profile)

//Ruta para cambiar la foto de perfíl del alumno utlizando la función updateImg()
router.post('/perfil/updateImg', isAuthenticated,updateImg)

export default router