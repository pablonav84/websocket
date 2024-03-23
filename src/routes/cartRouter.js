import { Router } from 'express';
import { CartManager } from '../classes/CartManager.js';
import { rutaCart } from '../utils.js';
export const router=Router()

const cartManager = new CartManager(rutaCart)

router.get("/", (req, res) => {

  
    res.setHeader('Content-Type', 'application/json');
      res.status(200).json({  });
  });