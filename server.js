const express = require('express');
/*Inicializamos express */
const app = express();
/*Router */
const routerProducts = express.Router();
const routerCart = express.Router();
/*CORS */
const cors = require('cors')
app.use(cors());


/*Importo modelos de productos, carrito y stock*/
const { Products } = require("./api/products");
const { Cart } = require('./api/cart');
const cart = new Cart;
const { Stock } = require('./api/stock');
const stock = new Stock;
const { Archivo } = require ('./api/archivo');
const archivoStock = new Archivo ('stock.txt');
const archivoCart = new Archivo ('cart.txt');


/*Body Parser: ya no es necesario */
const bodyParser = require('body-parser');

/*Compression: sirve para que el req.body pese menos*/
const compression = require ('compression');

/*----MIDDLEWARES----*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(compression());
app.use('/products', routerProducts);
app.use('/cart', routerCart);



/*----BOLLEAN ADMIN----*/
const admin = true;
// const admin = false;


/*------RUTAS STOCK-------*/
/*Consulta lista de productos en el stock */
routerProducts.get('/list/:id?', async (req, res) => {
    const productsOnFS = await archivoStock.readFile('stock.txt');
    req.params.id == undefined ? 
        res.json(productsOnFS) : 
        res.json(productsOnFS.find(product=>product.id == req.params.id));
});

/*Agregar producto al stock */
routerProducts.post('/add', async (req, res) => {

    if (stock.listOfStock.length === 0) {
        const productsOnFS = await archivoStock.readFile('stock.txt');
        stock.listOfStock.push(...productsOnFS);
    }

  
    if (admin) {

        let lastId = 0

        if (stock.listOfStock[stock.listOfStock.length-1] != undefined) {
            lastId = stock.listOfStock[stock.listOfStock.length-1].id;
            }

        const newProduct = new Products(title = req.body.title, price= req.body.price, thumbnail= req.body.thumbnail, id = lastId+1, description = req.body.description, code = req.body.code, stocked = req.body.stocked);
    
        const productAdd = stock.addProduct(newProduct);
        archivoStock.writeFile(stock.listOfStock);        
        res.json(productAdd);

    } else {
        res.json({error: -1, descripción: `ruta /products/add método "POST" no autorizada`});
    }
});

/*Modificar producto al stock */
routerProducts.put('/update/:id', async (req,res) => {

    if (admin) {

        const productOnStock = await archivoStock.readFile('stock.txt');
        const productFinded = productOnStock.findIndex((products) => products.id == req.params.id);

        if (productFinded == -1) {
            res.json(`No se encuentra producto con id`);

        } else {

            stock.listOfStock = [...productOnStock]
            const productUpload = stock.updateProduct({id: req.params.id, product: req.body})
            archivoStock.writeFile(stock.listOfStock);        
            res.json(productUpload);
        }
    } else {
        res.json({error: -1, descripción: `ruta /products/update método "PUT" no autorizada`});
    }

})

/*Eliminar producto al stock */
routerProducts.delete('/delete/:id', (req, res) => {
    if (admin) {
        const productDeleted = stock.deleteProduct(req.params.id);
        archivoStock.writeFile(stock.listOfStock);        
        res.json(productDeleted);
    } else {
        res.json({error: -1, descripción: `ruta /products/delete método "DELETE" no autorizada`});
    }
})


/*------RUTAS CARRITO-------*/
/*Consulta lista de productos en carrito */
routerCart.get('/list/:id?', async (req, res) => {

    const productsOnCart = await archivoCart.readFile('cart.txt');

    if (req.params.id == undefined) {
        res.json(productsOnCart)
    } else {
        const productFinded = productsOnCart.findIndex(productsOnCart => productsOnCart.product.id == req.params.id);
        if (productFinded != -1) {
            res.json(productsOnCart[productFinded]);
        } else {
            res.json(`No hay productos con ${req.params.id} en su carrito`)
        }
    }
});

/*Agregar producto a carrito */
routerCart.post('/add/:id_producto', async (req, res) => {

    const productOnStock = await archivoStock.readFile('stock.txt');
    console.log(productOnStock)

    const productFinded = productOnStock.findIndex(product=> product.id == req.params.id_producto);

    if (productFinded != -1 ) {
        const productsOnCart = await archivoCart.readFile('cart.txt');
        cart.cartContent = [...productsOnCart]
        if(productsOnCart.length == 0) {
            cart.addToCart(productOnStock[productFinded],0)
            archivoCart.writeFile(cart.cartContent);
            res.json({msg: 'Producto agregado'})
        } else {
            const lastId = productsOnCart[productsOnCart.length-1].id;
            cart.addToCart(productOnStock[productFinded], lastId);
            archivoCart.writeFile(cart.cartContent);
            res.json({msg: 'Producto agregado'});
        }
    } else {
        res.json({msg: `No se encuentra producto con ese ID`})
    }
});

/*Borrar producto a carrito */
routerCart.delete('/delete/:id', (req,res) =>{
    const productDeleted = cart.deleteProduct(req.params.id);
    archivoCart.writeFile(cart.cartContent);
    res.json(productDeleted)
})

/*Ruta de prueba para probar info de carrito: te muestra el ID del carrito, el timestamp y todos los productos */
routerCart.get('/infocart', (req,res)=>{
    res.json(cart.showDataCart())
})


/*-------------------*/
/*Ejecución de servidor*/
const PORT = 8080;
app.listen(8080, () => console.log(`Servidor iniciado en puerto ${PORT}`));