const ProductsManager = require("../managers/ProductManager");
const { join } = require("path");

const Router = require('express').Router;
const router = Router();

let rutaproducts = join(__dirname, "..", "data", "productos.json");
const productsManager = new ProductsManager(rutaproducts);

router.get("/", (req, res) => {

  let productos = productsManager.getProducts();
  let { limit, skip } = req.query;
  let resultado = productos;

  if (skip && skip > 0) {
    resultado = resultado.slice(skip);
  }
  
  if (limit && limit > 0) {
    resultado = resultado.slice(0, limit);
  }

  res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resultado });
});

router.get("/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = productsManager.getProductById(productId);

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
  
// Verificar si el campo "status" es booleano
  if (typeof status !== 'boolean' && status !== undefined) {
    res.status(400).json({ error: 'El campo "status" debe ser de tipo booleano' });
    return;
  }

  // Establecer el campo "status" por defecto como true
  const parsedStatus = (status === undefined || status === '') ? true : (status === 'true');

  let nuevoProducto = productsManager.addProduct({ title, description, price, thumbnail, code, status:parsedStatus, stock, category });
  res.setHeader('Content-Type', 'application/json');
  res.status(201).json({
      nuevoProducto
  });
});



router.put("/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedFields = req.body;

  // Agrega una validación para evitar modificar el ID del producto
  if (updatedFields.hasOwnProperty("id")) {
    return res.status(400).json({
      error: "No se permite modificar el ID del producto"
    });
  }

  const updatedProduct = productsManager.updateProduct(productId, updatedFields);

  if (updatedProduct) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({mensaje: "Su producto fue modificado con exito",
    updatedProduct });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.status(404).json({
      error: "Producto no encontrado"
    });
  }
});

router.delete("/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const deletedProduct = productsManager.deleteProduct(productId);

  if (deletedProduct) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ mensaje: "El producto ha sido eliminado exitosamente" });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.status(404).json({
      error: "Producto no encontrado"
    });
  }
});

module.exports = router;