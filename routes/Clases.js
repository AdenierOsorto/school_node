import express from 'express'
import { listarClases , guardarClase, eliminarClase, consultaClase, actualizarClase } from '../controllers/clases.js';
const router = express.Router()

//peticiones get
router.get('/clases', listarClases)
router.get('/clases/ingresarClase',(req, res) => {
    res.render('Clases/ingresarClase') 
})
router.get('/clases/editarClase/:id', consultaClase)




//peticiones Post
router.post('/clases/guardarClase', guardarClase)
router.post('/clases/eliminarClase/:id', eliminarClase)
router.post('/clases/actualizarClase/:id', actualizarClase)




export default router;