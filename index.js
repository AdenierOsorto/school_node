import './loadEnv.js'
import express from 'express'
import morgan from 'morgan'
import fileUpload from 'express-fileupload';
import cors from 'cors'
import bodyParser from 'body-parser'
import session from "express-session"
import cookieParser from "cookie-parser"
import path from'path'
import router from './routes/index.js'
import login from './routes/login.js'
import aulas from './routes/aulas.js'
import profesores from './routes/profesores.js'
import horario from './routes/horario.js'
import matricula from './routes/matricula.js'
import calificaciones from './routes/calificaciones.js'
import clases from './routes/Clases.js'
import hp from './routes/hp.js'
const __dirname = path.resolve()

const PORT = 7777
const app = express()
app.use(fileUpload())
app.use(cors())
const oneDay = 24*60*60*1000

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {maxAge: oneDay}
}))
app.use(cookieParser())
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/', express.static(__dirname + '/public'));

app.use('/alumnos',router)
app.use('/',login)
app.use('/',horario)
app.use('/',matricula)
app.use('/',calificaciones)
app.use('/',clases)
app.use('/aulas',aulas)
app.use('/hp',hp)
app.use('/profesores',profesores)

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})

