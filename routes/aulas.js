import express from 'express'
import { listarAula, eliminarAula, editarAula, guardarAulas, aula } from '../controllers/aulas.js'
import { isAuthenticated } from '../controllers/authLogin.js'

const router = express.Router()

//Redirige la ruta /aulas, con los datos de la función listarAula()
router.get('/', isAuthenticated,listarAula)

//Ruta para eliminar una aula utlizando la función eliminar aula()
router.delete('/eliminar', isAuthenticated, eliminarAula)

//Ruta para editar una aula utlizando la función editarAula()
router.post('/editar', isAuthenticated,editarAula)

//Redirige la /aulas luego de almacenar los datos de la función guardarAulas()
router.post('/guardar', isAuthenticated,guardarAulas)

//Redirige la ruta '/aulas/a', con los datos de la función aula()
router.get('/a', isAuthenticated,aula)

export default router