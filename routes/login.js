import express from 'express'
import { login, logout, isAuthenticated } from '../controllers/authLogin.js'
const router = express.Router()

// rutas para las vistas, verifica si esta logiado
router.get('/', isAuthenticated, (req, res) => { 
    res.render('panel', {user: req.session.user})
})
// ruta para el login del usuaro
router.get('/login', (req, res) => {
    res.render('base')
})
router.get('/logout', logout);

// rutas para los controllers
router.post('/login', login)

export default router