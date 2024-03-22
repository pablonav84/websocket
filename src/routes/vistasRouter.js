import { Router } from 'express';
import { ProductsManager } from '../classes/ProductsManager.js';
import { CartManager } from '../classes/CartManager.js';
import { rutaProducts, rutaCart } from '../utils.js';



export const router=Router()

let cartManager=new CartManager(rutaCart)
let productsManager=new ProductsManager(rutaProducts)

router.get('/',(req,res)=>{

  let productos= productsManager.getProducts()

  res.status(200).render("inicio", {productos})    
})

router.get('/compra',async(req,res)=>{

  let {idProduct}=req.query
  if(!idProduct){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`No recibimos productos...!!!`})
  }

  idProduct=Number(idProduct)
  if(isNaN(idProduct)){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`idProduct formato incorrecto`})
  }

  let cart=await cartManager.get()
  let product=await productsManager.getProductById(idProduct)

  res.status(200).render("compra",
  {
      cart, product
  })    
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