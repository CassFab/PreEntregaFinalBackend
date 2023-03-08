import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    if (fs.existsSync(path) == false) {
      fs.writeFileSync(path, JSON.stringify([]));
    }
  }

  static getNewId(lastProduct) {
    if (!lastProduct) {
      return 1;
    } else {
      return lastProduct.id + 1;
    }
  }

  async getProducts() {
    let products = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(products);
  }

  async addProduct(title, description, code, price, status, stock, thumbnails) {
    let products = await this.getProducts();
    let codes = products.map((p) => p.code);

    if (codes.includes(code)) {
      console.log("Este producto ya existe");
      return;
    }

    if (!title || !description || !price || !thumbnails || !code || !stock) {
      console.error("Por favor complete todos los campos");
      return;
    }

    let lastProduct = products[products.length - 1];
    let newId = ProductManager.getNewId(lastProduct);
    let newProduct = {
      title: title,
      description: description,
      code: code,
      price: price,
      status: status,
      stock: stock,
      thumbnails: thumbnails,
      id: newId,
    };

    products.push(newProduct);
    fs.writeFileSync(this.path, JSON.stringify(products));
    return newProduct;
  }

  async getProductById(id) {
    let products = await this.getProducts();
    let product = products.find((p) => p.id === parseInt(id));
    if (product) {
      return product;
    } else {
      return { error: `Product with ID ${id} not found` };
    }
  }

  async updateProduct(id, updatedProduct) {
    let products = await this.getProducts();
    let productIndex = products.findIndex((p) => p.id == id);

    products[productIndex] = { ...products[productIndex], ...updatedProduct };
    await fs.promises.writeFile(this.path, JSON.stringify(products));
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    let productIndex = products.findIndex((p) => p.id == id);

    products.splice(productIndex, 1);
    await fs.promises.writeFile(this.path, JSON.stringify(products));
  }
}

export default ProductManager;

