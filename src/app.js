const express=require("express")
const productManager=require('./productManager')

const path = require('path');
const jsonFilePath = path.resolve(__dirname, 'productos.json');


const PORT=8080
const app=express()


const pm = new productManager(jsonFilePath);

app.get("/", async(req, res)=>{
    res.send("Server básico express ccorriendo...")
})

app.get("/productos", async (req, res) => {
    try {
        let productos = await pm.getProducts();
      let { limit, skip } = req.query;
      let resultado = productos;
  
      if (skip && skip > 0) {
        resultado = resultado.slice(skip);
      }
if (isNaN(skip)){
    return res.send("Por favor ingrese un valor numérico")
}      
      if (limit && limit > 0) {
        resultado = resultado.slice(0, limit);
      }
      if (isNaN(limit)){
        return res.send("Por favor ingrese un valor numérico")
    }     
      res.json(resultado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  });
 
  app.get("/productos/:id", async (req, res) => {
    let { id } = req.params;
    id = Number(id);
    if (isNaN(id)) {
      return res.send("El id tiene que ser de tipo numérico");
    }
  
    try {
      let productos = await pm.getProducts();
  
      let producto = productos.find((producto) => producto.id === id);
      if (!producto) {
        return res.send(`No existen productos con el id ${id}`);
      }
      res.json(producto);
    } catch (error) {
      console.log(error);
      res.send("Error al obtener el producto");
    }
  });

app.listen(PORT, ()=>{
    console.log(`Server On Line en puerto ${PORT}`)
})