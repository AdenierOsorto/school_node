import express from 'express'
const router = express.Router()

router.get('/profesores', (req, res)=>{
    res.render('profesores');
});

export default router;