import express from 'express'
import { guardarHP, hp, listarhp } from '../controllers/hp.js'
const router = express.Router()

//Redirige la ruta /hp, con los datos de la función listarhp()
router.get('/',listarhp)
router.get('/a',hp)
router.post('/guardar',guardarHP)

export default router