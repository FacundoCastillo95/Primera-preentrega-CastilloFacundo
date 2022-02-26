const express = require('express');
/* const productos = require('./api/productos'); */
/* const routerProductos = express.Router(); */

// creo app express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// escuchar peticiones
const router = require('./routers/productos');
const routerCarrito = require("./routers/carrito")
app.use('/api/productos', router);
app.use("/api/carrito", routerCarrito)
// pongo a escuchar el servidor en el puerto indicado
app.listen(8080, () => console.log("listening"))


// en caso de error, avisar
server.on('error', error => {
    console.log('error en el servidor:', error);
});


module.exports = server;