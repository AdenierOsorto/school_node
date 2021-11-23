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
import profesores from './routes/profesores.js'
const __dirname = path.resolve()

const PORT = 11000
const app = express()
app.use(fileUpload())
app.use(cors())
const oneDay = 24*60*60*1000
/* 
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {maxAge: oneDay}
}))
app.use(cookieParser()) */
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/', express.static(__dirname + '/public'));

app.use('/',router)
app.use('/',profesores)

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})

