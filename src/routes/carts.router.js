const ProductsManager = require("../managers/ProductManager");
const { join } = require("path");
const fs=require("fs")

const Router = require('express').Router;
const router = Router();

let rutaproducts = join(__dirname, "..", "data", "cart.json");
const productsManager = new ProductsManager(rutaproducts);

router.get("/", (req, res) => {

    let productos = productsManager.getProducts();
  
    res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ productos });
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
    const { products } = req.body;
  
  let cartProduct = productsManager.addProduct({ products });
  res.setHeader('Content-Type', 'application/json');
  res.status(201).json({
      cartProduct
  });
});

router.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { product, quantity } = req.body;
  const productObj = {
    id: cid,
    product: pid,
    quantity: quantity
  };

  // Verificar si el carrito existe
  const cartExists = productsManager.getProducts(cid);
  if (!cartExists) {
    // Enviar una respuesta de error si el carrito no existe
    res.status(404).json({ error: 'El carrito no existe' });
    return;
  }

  let obtenerProducts = productsManager.getProducts();

  const existingProduct = obtenerProducts.find(p => p.product === pid);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    obtenerProducts.push(productObj);
  }

  productsManager.updateProduct(obtenerProducts);

  fs.writeFileSync(rutaproducts, JSON.stringify(obtenerProducts, null, 5));

  res.setHeader('Content-Type', 'application/json');
  res.status(201).json({
    product: productObj
  });
});

  
  module.exports = router;