import express from 'express'
import { listarAula, eliminarAula, editarAula, guardarAulas, aula } from '../controllers/aulas.js'

const router = express.Router()

//Redirige la ruta /aulas, con los datos de la función listarAula()
router.get('/',listarAula)

//Ruta para eliminar una aula utlizando la función eliminar aula()
router.delete('/eliminar', eliminarAula)

//Ruta para editar una aula utlizando la función editarAula()
router.post('/editar',editarAula)

//Redirige la /aulas luego de almacenar los datos de la función guardarAulas()
router.post('/guardar',guardarAulas)

//Redirige la ruta '/aulas/a', con los datos de la función aula()
router.get('/a',aula)

export default router