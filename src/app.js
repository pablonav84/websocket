const express=require('express');
const productsRouter=require("./routes/products.router")
const cartsRouter=require("./routes/carts.router")

const PORT=8080;
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.get('/', (req, res)=>{
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send('server corriendo');
})

const server=app.listen(PORT,()=>{
  console.log(`Server escuchando en puerto ${PORT}`)
});