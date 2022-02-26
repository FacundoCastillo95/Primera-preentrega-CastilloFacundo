const path = require("path")
const fs = require("fs/promises")
const { timingSafeEqual } = require("crypto")

class Carrito {
  constructor() {
    this.path = path.join(__dirname, "../database/carrito.json")
    this.data = [] 
  }

  async crearCarrito(carrito) {
    await this.readData()
    carrito.timestamp = Date.now()
    carrito.id = this.data[this.data.length - 1].id + 1
    this.data.push(carrito)
    await this.writeData()
  }

  async agregarProducto(id, producto) {
    await this.readData()
    const carrito = this.data.find(c => c.id == id)
    if (!carrito) {
      throw new Exception("no existe")
    }

    // validar que exista el producto
    carrito.productos.push(producto)

    await this.writeData()
  }

  async borrarProducto(id, idProd) {
    await this.readData()
    const carrito = this.getCarrito(id)

    // validar que el carrito tenga productos
    carrito.productos = carrito.productos.filter(p => p.id != idProd)

    await this.writeData()
  }

  getCarrito(id) {
    const carrito = this.data.find(c => c.id == id)
    if (!carrito) {
      throw new Exception("no existe")
    }

    return carrito
  }

  async readData() {
    this.data = JSON.parse(await (fs.readFile(this.path, "utf8")))
  }

  async writeData() {
    await fs.writeFile(this.path, JSON.stringify(this.data, null, 2))
  }
}

module.exports = new Carrito()