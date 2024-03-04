import { Router } from 'express';
import { ProductsManager } from '../classes/ProductsManager.js';
import { rutaProducts } from '../utils.js';


export const router=Router()

let productsManager=new ProductsManager(rutaProducts)

router.get('/', (req, res)=>{
  res.status(200).render("inicio")
})

router.get('/realTimeProducts', (req, res)=>{

  let products=productsManager.getProducts()
  res.status(200).render("realTimeProducts", {products})
})

router.get('/createProduct', (req, res)=>{

  res.status(200).render("createProduct")
})

router.get('/productos', (req, res)=>{
  let products=productsManager.getProducts()
  res.status(200).render("productos", {products})
})