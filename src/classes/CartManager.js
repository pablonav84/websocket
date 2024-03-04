import fs from "fs"

export class CartManager{
    constructor(ruta){
        this.ruta=ruta
    }
        getProducts(ruta){
            if(fs.existsSync(this.ruta)){
                return JSON.parse(fs.readFileSync(this.ruta, {encoding:'utf-8'}))
            }else{
                return []
            }
}

saveDatos(ruta, datos){
    fs.writeFileSync(ruta, JSON.stringify(datos, null, 5))
}
  
    addProduct() {

        let products = this.getProducts();
    
        let id = 1;
        if (products.length > 0) {
            // Filtrar los productos con valores de ID nulos o indefinidos
            let filteredProducts = products.filter(p => p.id !== null && p.id !== undefined);
            id = Math.max(...filteredProducts.map(d => d.id)) + 1;
        }
    
        let nuevoProducto = {
            id,
            products:[{}],
        };
    
        products.push(nuevoProducto);
        this.saveDatos(this.ruta, products);
    
        return nuevoProducto;
    }

    getProductById(id) {
        let products = this.getProducts();
        let foundProduct = products.find(product => product.id === id);
    
        return foundProduct;
      }
}