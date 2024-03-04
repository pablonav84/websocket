import { Router } from 'express';
import { CartManager } from '../classes/CartManager.js';
import { rutaCart } from '../utils.js';
export const router=Router()

const cartManager = new CartManager(rutaCart)

router.get("/", (req, res) => {

    let listCart = cartManager.getProducts();
  
    res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ listCart });
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

  router.post('/', (req, res) => {
  
  let cartProduct = cartManager.addProduct();
  res.setHeader('Content-Type', 'application/json');
  res.status(201).json({
      cartProduct
  });
});