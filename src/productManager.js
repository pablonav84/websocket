const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.id = 0;
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    this.id++; //id autoincrementable
  let products=await this.getProducts()
    

    //valido si se intentan crear dos productos código duplicado
    const TestCode = products.find(product => product.code === code);
  if (TestCode) {
    console.log("Error: No se puede crear dos productos con el mismo código");
    return;
  }
    //Valido si se agrega o no el producto al array
    if (products.push({ 
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id: this.id,
    }) !== -1) { //envío los argumentos al array vacío
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2)); //escribo el archivo
      console.log("Producto Agregado Correctamente");
    } else {
      console.log("Error Al Agregar El Producto");
    }
  }
  
  async watchProducts() { //función auxiliar para leer el archivo creado
    let products = await fs.promises.readFile(this.path, { encoding: "utf-8" });
    return JSON.parse(products);
  }

  async getProducts(){
    if(fs.existsSync(this.path)){
      return JSON.parse(await fs.promises.readFile(this.path, {encoding:"utf-8"}))
    } else {
      return []
    }
  }

  async getProductById(id) {
    const products = await this.watchProducts(); //leo el archivo a través de la función watchProducts
    const product = products.find((p) => p.id === id); //por medio de find comparo el id enviado con los id existentes
    
    //valido la existencia o no del id
    if (product) {
      return console.log("Su Busqueda Por id Es:", product);
    } else console.log("El id " + id + " Ingresado No Existe");
  }
  
async updateProduct(id, updatedFields) {
  const products = await this.watchProducts(); //leo el archivo desde watchProducts
  const index = products.findIndex((p) => p.id === id); //creo una constante adonde almacenaré el resultado de findIndex

  //validaciones
  //comparo el id existente en updatedFields con el id enviado para verificar que no se modifique
  if (updatedFields.id && updatedFields.id !== id) {
    console.log("Error: No se puede modificar el ID del producto.");
    return;
  }
  if (index !== -1) { //si se encuentra el producto (diferente a -1) almaceno en products fusionando los campos existentes con los modificados en updateFields
    products[index] = { ...products[index], ...updatedFields };
    
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2)); //escribo en products
    console.log("El Producto Con El id " + id + " Fue Actualizado Correctamente", products[index]);
  } else {
    console.log("Error Al Actualizar El Producto: El id " + id + " No Existe");
  }
}

  async deleteProduct(id) {
    let respWatchProduct = await this.watchProducts(); //leo el archivo desde watchProducts
    let filter = respWatchProduct.filter((products) => products.id !== parseInt(id)); //comparo el id enviado atraves del argumento con los id que existen y lo filtro
    await fs.promises.unlink(this.path) //elimino el archivo
    await fs.promises.writeFile(this.path, JSON.stringify(filter, null, 2)); //escribo en la variable filter los id resultantes
    
    // Validar si el producto fue eliminado
    let isDeleted = await respWatchProduct.some((products) => products.id === parseInt(id));
    if (isDeleted === true) {
      console.log("El producto con el ID " + id + " ha sido eliminado exitosamente.");
    } else {
      console.log("No se encontró ningún producto con el ID " + id + ".");
    }
  }
}

module.exports=ProductManager
/*
//Creo archivo Productos
const productManager = new ProductManager(path.join(__dirname, "productos.json"));

//Uso del Código
//Agregar productos al array
const app = async () => {
await productManager.addProduct("Nike", "zapas blancas", 100000, "img1", "abc123", 50);
await productManager.addProduct("Adidas", "zapas negras", 120000, "img2", "abc124", 100);
await productManager.addProduct("Jordan", "zapas grises", 130000, "img3", "abc125", 120);
await productManager.addProduct("Jordan", "zapas rojas", 150000, "img3", "abc126", 80);
await productManager.addProduct("Adidas", "zapas blancas", 120000, "img3", "abc127", 70);

//Obtener producto por id
await productManager.getProductById(9)

//Para actualizar un producto
const updateFields = {
  title:"pablo2",
  description:"navarro2",
  price:150,
  thumbnail:"img3",
  code:"pou983",
  stock:10,
  id:4,
};
await productManager.updateProduct(1, updateFields)

//Para eliminar un producto por id
await productManager.deleteProduct(2)
console.log(await productManager.watchProducts())
}
app();
*/