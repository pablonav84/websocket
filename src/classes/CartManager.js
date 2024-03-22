import fs from "fs"

export class CartManager{
    constructor(ruta){
        this.path=ruta
    }
    get() {
        if (fs.existsSync(this.path)) {
          const data = fs.readFileSync(this.path, { encoding: 'utf-8' });
            return JSON.parse(data);
        } else {
          return [];
        }
      }
      
      create(cart) {
        let carts = this.get();
      
        let id = 1;
        if (carts.length > 0) {
          id = Math.max(...carts.map(d => d.id)) + 1;
        }
      
        let cartNuevo = {
          id, ...cart
        };
      
        carts.push(cartNuevo);
        if (cartNuevo) {
          fs.writeFile(this.path, JSON.stringify(carts, null, 5), (err) => {
            if (err) {
              console.error(err);
            }
          });
        } else {
          console.log("error");
          return null;
        }
        return cartNuevo;
      }      
}