import express from 'express';
import __dirname, { rutaCart } from './utils.js'
import path from "path"
import handlebars from "express-handlebars"
import {Server} from "socket.io"
import { router as productsRouter } from './routes/productsRouter.js';
import { router as cartRouter } from './routes/cartRouter.js';
import { router as vistasRouter } from './routes/vistasRouter.js';
import { CartManager } from './classes/CartManager.js';

const PORT=8080;
let io;

const app=express();

//manipulacion de json
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//alta al contenido estático
app.use(express.static(path.join(__dirname, "public")))

//motor de vistas handlebars
app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

app.use('/api/products', (req, res, next)=>{
    req.io=io
    next()
}, productsRouter)

app.use('/api/carts', cartRouter)
app.use('/', vistasRouter)
app.use('/carts', vistasRouter)
app.use('/compra', vistasRouter)

app.post("/productos/:id/:description", (req, res)=>{
    console.log(req.params)  
    res.status(200).json({mensaje:"compra correcta...!!!"})
  })

app.get('*', (req, res)=>{
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('error 404 - page not found');
})
const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

io=new Server(server)

const cartManager=new CartManager(rutaCart)
io.on ("connection", socket=>{
console.log(`Cliente Conectado con el id ${socket.id}`)
socket.emit("saludo", {emisor:"server", mensaje:"Bienvenido al server"})

socket.on("compra", (idCart, id, description)=>{
    cartManager.comprar(idCart, id, description)
})
})