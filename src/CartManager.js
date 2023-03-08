import fs from "fs";

class CartManager {
  #nextId = 0;

  constructor() {
    this.path = "./carts.json";
  }


  async addCart() {
    const carts = await this.getCarts();

    const newCart = {
      id: this.#nextId,
      products: [],
    };

    const updatedCarts = [...carts, newCart];

    await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts));

    this.#nextId++;

    return { statusCode: 201, data: newCart };
  }


  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();

    const updatedCarts = carts.map((c) => {
      if (c.id === cartId) {
        const existingProduct = c.products.find((p) => p.id === productId);

        if (existingProduct) {
          const updatedProducts = c.products.map((p) => {
            if (p.id === productId) {
              return {
                ...p,
                quantity: p.quantity + 1,
              };
            }

            return p;
          });

          return {
            ...c,
            products: updatedProducts,
          };
        }

        return {
          ...c,
          products: [...c.products, { id: productId, quantity: 1 }],
        };
      }

      return c;
    });

    await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts));

    return this.getCartById(cartId);
  }


  async getCarts() {
    try {
      const cartsJson = await fs.promises.readFile(this.path, "utf-8");

      return JSON.parse(cartsJson);
    } catch (err) {
      return [];
    }
  }

  async getCartById(cartId) {
    const carts = await this.getCarts();

    const cart = carts.find((c) => c.id === cartId);

    return cart;
  }
}

export default CartManager;


