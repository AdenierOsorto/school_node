import express from 'express'
import { isAuthenticated } from '../controllers/authLogin.js';
import { listarClases , guardarClase, eliminarClase, consultaClase, actualizarClase } from '../controllers/clases.js';
const router = express.Router()

//peticiones get
router.get('/clases', isAuthenticated,listarClases)
router.get('/clases/ingresarClase',isAuthenticated,(req, res) => {
    res.render('Clases/ingresarClase') 
})
router.get('/clases/editarClase/:id',isAuthenticated, consultaClase)




//peticiones Post
router.post('/clases/guardarClase', isAuthenticated, guardarClase)
router.post('/clases/eliminarClase/:id',isAuthenticated, eliminarClase)
router.post('/clases/actualizarClase/:id', isAuthenticated, actualizarClase)




export default router;