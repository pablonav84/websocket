import { Router } from 'express';
import { ProductsManager } from '../classes/ProductsManager.js';
import { rutaProducts } from '../utils.js';
export const router=Router()

let productsManager=new ProductsManager(rutaProducts)

router.get('/', async(req,res)=>{
  let products= await productsManager.getProducts()
  res.status(200).json({products})
})

router.post('/', (req, res) => {
  const { title, description, price, thumbnail, code, status, stock, category } = req.body;
  // Verificar si alguno de los campos está incompleto
  if (!title || !description || !price || !code || !stock || !category) {
      res.status(400).json({ error: 'Hay campos que faltan ser completados' });
      return;
  }
  // Verificar si el código ya existe
  const existCode = productsManager.getProducts().find(product => product.code === code);
  if (existCode) {
      res.status(400).json({ error: 'Ya existe un producto con el mismo código' });
      return;
  }
  // Establecer el campo "status" por defecto como true
  const parsedStatus = (status === undefined || status === '') ? true : (status === 'true');
  let nuevoProducto = productsManager.addProduct({ title, description, price, thumbnail, code, status:parsedStatus, stock, category });
  req.io.emit("nuevoProducto", nuevoProducto)
  res.setHeader('Content-Type', 'application/json');
  res.status(201).json({
      nuevoProducto
  });
});

router.delete("/", (req, res) => {
  const productId = parseInt(req.body.id);
  const deletedProduct = productsManager.deleteProduct(productId);
  if (deletedProduct) {
    let remaining=productsManager.getProducts()
    req.io.emit("productoEliminado", remaining)
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ mensaje: "El producto ha sido eliminado exitosamente" });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.status(404).json({
      error: "Producto no encontrado"
    });
  }
});