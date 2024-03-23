import { Router } from 'express';
import { ProductsManager } from '../classes/ProductsManager.js';
import { rutaCart, rutaProducts } from '../utils.js';
import { CartManager } from '../classes/CartManager.js';
export const router=Router()

let productsManager=new ProductsManager(rutaProducts)
let cartManager=new CartManager(rutaCart)

router.get('/', async (req, res)=>{
  let cart=await cartManager.getCarts()
    res.status(200).render("inicio", {cart})
})

router.get('/carts', async (req, res)=>{
  let cart=await cartManager.getCarts()
    res.status(200).render("carts", {cart})
})

router.get('/realTimeProducts', async (req, res)=>{
  let {cid}=req.query
  if(!cid){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`No se recibieron datos...!!!`})
  }
  cid=Number(cid)
  if(isNaN(cid)){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`idCart formato incorrecto`})
  }
  let products=await productsManager.getProducts()
  let cart=await cartManager.getById(cid)
    res.status(200).render("realTimeProducts", {products, cart})
})

router.get('/createProduct', (req, res)=>{
  res.status(200).render("createProduct")
})

router.get('/productos', async (req, res)=>{
  let products= await productsManager.getProducts()
  res.status(200).render("productos", {products})
})