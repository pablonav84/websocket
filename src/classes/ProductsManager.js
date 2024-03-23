import fs from "fs"

export class ProductsManager{
    constructor(ruta){
        this.path=ruta
    }

    async getProducts(){
        if(fs.existsSync(this.path)){
            return JSON.parse(await fs.promises.readFile(this.path, {encoding:'utf-8'}))
        }else{
            return []
        }
}

saveDatos(ruta, datos){
    fs.writeFileSync(ruta, JSON.stringify(datos, null, 5))
}

addProduct(product) {

    let products = this.getProducts();

    let id = 1;
    if (products.length > 0) {
        // Filtrar los productos con valores de ID nulos o indefinidos
        let filteredProducts = products.filter(p => p.id !== null && p.id !== undefined);
        id = Math.max(...filteredProducts.map(d => d.id)) + 1;
    }

    let nuevoProducto = {
        id,
        ...product
    };

    products.push(nuevoProducto);
    this.saveDatos(this.path, products);

    return nuevoProducto;
}

getProductById(id) {
    let products = this.getProducts();
    let foundProduct = products.find(product => product.id === id);

    return foundProduct;
  }

  updateProduct(id, updatedFields) {
      const products = this.getProducts();
      const index = products.findIndex((p) => p.id === id);
       
      if (index !== -1) { 
        products[index] = { ...products[index], ...updatedFields };
        
        this.saveDatos(this.path, products);
    } return products[index];
  }

  deleteProduct(id) {
      const products = this.getProducts();
      const index = products.findIndex((p) => p.id === id);
    
      if (index !== -1) {
        const deletedProduct = products.splice(index, 1)[0];
        this.saveDatos(this.path, products);
        return deletedProduct;
      } else {
        return null;
      }
    }
}