import { Router } from 'express';
import { CartManager } from '../classes/CartManager.js';
import { rutaCart } from '../utils.js';
export const router=Router()

const cartManager = new CartManager(rutaCart)

router.post("/", (req, res) => {

  let {descrip}=req.body
  if(!descrip){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`Complete descrip del curso...!!!`})
  }

  // validar curso descrip no repetido...

  let nuevoCart= cartManager.create({descrip})   
  if(!nuevoCart){
      res.setHeader('Content-Type','application/json');
      return res.status(500).json({error:`Error inesperado en el servidor`})
  }
  req.io.emit("nuevoCart", nuevoCart)

  res.setHeader('Content-Type','application/json')
  res.status(201).json({nuevoCart})
  });

  router.get("/:id", (req, res) => {
    const productId = parseInt(req.params.id);
    const product = cartManager.getProductById(productId);
  
    if (product) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ mensaje:"Su busqueda por id es:",
      product });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(404).json({
        error: "Id inexistente"
      });
    }
  });