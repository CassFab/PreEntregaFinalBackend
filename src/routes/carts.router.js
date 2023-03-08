import express from "express";
import CartManager from "../CartManager.js";

const manager = new CartManager();
const router = express.Router();

router.post("/", async (req, res) => {
  const cart = await manager.addCart();

  res.status(cart.statusCode).send({ data: cart.data });
});

router.get("/", async (req, res) => {
  const carts = await manager.getCarts();
  res.send({ data: carts });
});

router.get("/:cid", async (req, res) => {
  const cid = Number(req.params.cid);

  const cart = await manager.getCartById(cid);

  if (!cart) {
    return res.status(404).send({ error: `Cart with ID ${cid} not found` });
  }

  res.send({ data: cart });
});

router.post("/:cid/products/:pid", async (req, res) => {
  const cartId = Number(req.params.cid);
  const prodId = Number(req.params.pid);
  const result = await manager.addProductToCart(cartId, prodId);

  res.send(result);
});

export default router;
