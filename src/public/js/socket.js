const socket=io()

socket.on("saludo", (datos)=>{
    console.log(`${datos.emisor} dice: "${datos.mensaje}"`)
})
  
socket.on("nuevoProducto", datos => {
    console.log(datos);
    let ulProductos = document.getElementById("productos");
    ulProductos.innerHTML +=
      `<li>Categoría: ${datos.category}
      <ul>
        <li>Id: ${datos.id}</li>
        <li>Marca: ${datos.title}</li>
        <li>Descripción: ${datos.description}</li>
        <li>Precio: ${datos.price}</li>
        <button onclick="comprar('${datos.id}', '${datos.description}')">Comprar</button>
      </ul>
       </li>`;
  });
  
  const comprar=(id, description)=>{
    console.log({id, description})
  }

  socket.on("productoEliminado", datos => {
    console.log(datos);
    let ulProductos = document.getElementById("productos");
    ulProductos.innerHTML = ""; // Limpiar el contenido existente antes de agregar nuevos elementos
  
    datos.forEach(dato => {
      let li = document.createElement("li");
      li.innerHTML = `
        Categoría: ${dato.category}
        <ul>
          <li>Id: ${dato.id}</li>
          <li>Marca: ${dato.title}</li>
          <li>Descripción: ${dato.description}</li>
          <li>Precio: ${dato.price}</li>
        </ul>
      `;
  
      let button = document.createElement("button");
      button.innerHTML = "Comprar";
      button.addEventListener("click", () => {
        comprar(dato.id, dato.description);
      });
  
      li.appendChild(button);
      ulProductos.appendChild(li);
    });
  });

  socket.on("nuevoCart", datos=>{
    console.log(datos)
    let ulCarts=document.getElementById("cart") 
    ulCarts.innerHTML+=`<li>${datos.descrip} <button onclick="compra('${datos.id}','${datos.descrip}')">Comprar</button></li>`

})

  const compra=async(idCart, descrip)=>{
    let idProduct=document.getElementById("idProduct").innerHTML
    console.log({idCart, descrip, idProduct})
    let respuesta=await fetch(idCart+"/"+"http://localhost:3000/product/"+descrip, 
    {
        method:"post"
    })
    let datos=await respuesta.json()
    console.log(datos)
}
